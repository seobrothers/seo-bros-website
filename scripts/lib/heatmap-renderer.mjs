/**
 * Shared heatmap renderer for the city-search-volume choropleth maps.
 *
 * Pass a config (volumes, polygon-name -> key map, bbox, marker points, etc.)
 * and the renderer returns a complete SVG string. Each city's build script
 * supplies its own keyword volumes and GeoJSON path.
 */

const TEAL_RAMP = ['#cfeaee', '#9ed5dc', '#6dc0ca', '#33c4d1', '#28a5b1', '#1e8892'];
const COLOR_NO_DATA = '#eef2f6';
const COLOR_ZERO = '#dbe5ea';
const COLOR_WATER = '#eef5f8';
const COLOR_LAND_STROKE = '#ffffff';
const COLOR_TEXT = '#0f172a';
const COLOR_TEXT_MUTED = '#64748b';

function colorForVolume(vol, max) {
  if (vol === null || vol === undefined) return COLOR_NO_DATA;
  if (vol === 0) return COLOR_ZERO;
  const pct = vol / max;
  if (pct >= 0.7) return TEAL_RAMP[5];
  if (pct >= 0.45) return TEAL_RAMP[4];
  if (pct >= 0.25) return TEAL_RAMP[3];
  if (pct >= 0.1) return TEAL_RAMP[2];
  if (pct >= 0.03) return TEAL_RAMP[1];
  return TEAL_RAMP[0];
}

function isDarkFill(fill) {
  return fill === TEAL_RAMP[5] || fill === TEAL_RAMP[4] || fill === TEAL_RAMP[3];
}

function makeProjection(viewBox, bbox, centerLat) {
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  const lonRange = (bbox.maxLon - bbox.minLon) * cosLat;
  const latRange = bbox.maxLat - bbox.minLat;
  const padding = 32;
  const w = viewBox.width - padding * 2;
  const h = viewBox.height - padding * 2;
  const scale = Math.min(w / lonRange, h / latRange);
  const offsetX = padding + (w - lonRange * scale) / 2;
  const offsetY = padding + (h - latRange * scale) / 2;
  return ([lon, lat]) => {
    const x = (lon - bbox.minLon) * cosLat * scale + offsetX;
    const y = (bbox.maxLat - lat) * scale + offsetY;
    return [x, y];
  };
}

const MIN_PX = 1.0;
function ringToPath(ring, project) {
  const projected = ring.map(project);
  const kept = [projected[0]];
  for (let i = 1; i < projected.length - 1; i++) {
    const last = kept[kept.length - 1];
    const cur = projected[i];
    const dx = cur[0] - last[0];
    const dy = cur[1] - last[1];
    if (dx * dx + dy * dy >= MIN_PX * MIN_PX) kept.push(cur);
  }
  kept.push(projected[projected.length - 1]);
  return kept
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ') + ' Z';
}
function geometryToPath(geom, project) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  return polys.map((poly) => poly.map((ring) => ringToPath(ring, project)).join(' ')).join(' ');
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0, n = ring.length - 1; i < n; i++) {
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return a / 2;
}
function ringCentroid(ring) {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0, n = ring.length - 1; i < n; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const f = x0 * y1 - x1 * y0;
    a += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  a *= 3;
  return a === 0 ? [ring[0][0], ring[0][1]] : [cx / a, cy / a];
}

/**
 * Render the heatmap SVG.
 *
 * @param {object} config
 * @param {object} config.geojson - Loaded GeoJSON FeatureCollection.
 * @param {string} config.nameField - GeoJSON property holding each polygon's name.
 * @param {object} config.volumes - Map of key -> avg monthly searches (number, or 0).
 * @param {object} config.nameToKey - Map of polygon name -> volumes key (or omit if unmapped).
 * @param {object} config.labelForKey - Map of key -> human-readable label.
 * @param {object} config.bbox - { minLon, maxLon, minLat, maxLat } for cropping.
 * @param {number} config.centerLat - Center latitude for projection scaling.
 * @param {number} config.viewWidth - Output viewBox width in px.
 * @param {string} config.title - Big title string.
 * @param {string} config.subtitle - Subtitle string under the title.
 * @param {object} config.labelOffsets - Per-key { dx, dy, anchor } for nudging labels and adding leader lines.
 * @param {Array} config.markers - Hand-anchored markers for sub-neighbourhoods that aren't their own polygon. Each: { latlon: [lon,lat], label, sub, dx?, dy? }.
 * @param {number} [config.titleCardWidth] - Width of the white title card. Default 800.
 * @param {string} [config.attribution] - Attribution line, bottom right.
 */
export function renderHeatmap(config) {
  const {
    geojson, nameField, volumes, nameToKey, labelForKey,
    bbox, centerLat, viewWidth, title, subtitle, labelOffsets = {}, markers = [],
    titleCardWidth = 800,
    attribution = 'Boundaries: open data · Volumes: Google Keyword Planner',
  } = config;

  const features = geojson.features.map((f) => {
    const name = f.properties[nameField];
    const key = nameToKey[name] || null;
    const volume = key ? volumes[key] : null;
    return { feature: f, name, key, volume };
  });

  const maxVolume = Math.max(...Object.values(volumes));
  const VIEW_W = viewWidth;
  const VIEW_H =
    (bbox.maxLat - bbox.minLat) /
    ((bbox.maxLon - bbox.minLon) * Math.cos((centerLat * Math.PI) / 180)) *
    VIEW_W;
  const project = makeProjection({ width: VIEW_W, height: VIEW_H }, bbox, centerLat);

  // Group by key for label anchoring.
  const groups = new Map();
  for (const ent of features) {
    if (!ent.key) continue;
    if (!groups.has(ent.key)) groups.set(ent.key, []);
    groups.get(ent.key).push(ent);
  }

  // Anchor label at centroid of largest polygon in the group.
  const labelAnchors = new Map();
  for (const [key, ents] of groups.entries()) {
    let bestRing = null, bestArea = -Infinity;
    for (const { feature: f } of ents) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const poly of polys) {
        const ring = poly[0];
        const a = Math.abs(ringArea(ring));
        if (a > bestArea) { bestArea = a; bestRing = ring; }
      }
    }
    if (bestRing) labelAnchors.set(key, ringCentroid(bestRing));
  }

  // Render order: lowest-volume first so high-volume areas paint on top.
  const ordered = [...features].sort((a, b) => (a.volume ?? -1) - (b.volume ?? -1));

  let pathsSvg = '';
  for (const { feature: f, volume } of ordered) {
    const fill = colorForVolume(volume, maxVolume);
    const path = geometryToPath(f.geometry, project);
    pathsSvg += `<path d="${path}" fill="${fill}" stroke="${COLOR_LAND_STROKE}" stroke-width="0.7" stroke-linejoin="round" />\n`;
  }

  // Labels.
  let labelsSvg = '';
  for (const [key, [lon, lat]] of labelAnchors.entries()) {
    const [cx, cy] = project([lon, lat]);
    const off = labelOffsets[key] || { dx: 0, dy: 0, anchor: 'middle' };
    const tx = cx + off.dx;
    const ty = cy + off.dy;
    const vol = volumes[key];
    const label = labelForKey[key];
    const volStr = vol === 0 ? '0' : vol.toLocaleString('en-US');
    const pctOfMax = vol === 0 ? 0 : Math.round((vol / maxVolume) * 100);
    const subStr = vol === 0 ? 'no commercial volume' : `${volStr}/mo · ${pctOfMax}%`;
    const fill = colorForVolume(vol, maxVolume);
    const onDark = isDarkFill(fill) && Math.abs(off.dx) + Math.abs(off.dy) === 0;
    const titleColor = onDark ? '#ffffff' : COLOR_TEXT;
    const subColor = onDark ? 'rgba(255,255,255,0.95)' : COLOR_TEXT_MUTED;
    const halo = onDark ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.92)';
    if (Math.abs(off.dx) + Math.abs(off.dy) > 0) {
      const leadEndX = off.anchor === 'start' ? tx - 4 : (off.anchor === 'end' ? tx + 4 : tx);
      labelsSvg += `<line x1="${cx}" y1="${cy}" x2="${leadEndX}" y2="${ty - 6}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" />\n`;
    }
    labelsSvg += `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif" text-anchor="${off.anchor}" paint-order="stroke fill" stroke="${halo}" stroke-width="2.2" stroke-linejoin="round">
    <text x="${tx}" y="${ty - 4}" fill="${titleColor}" font-size="16" font-weight="600">${label}</text>
    <text x="${tx}" y="${ty + 13}" fill="${subColor}" font-size="12" font-weight="500">${subStr}</text>
  </g>\n`;
  }

  // Markers. `onDark` means the marker sits on a dark-fill polygon (Spryfield
  // on Halifax, Mountain on Hamilton). Default is light fill (Ayr in a gray
  // township), which needs dark text to read.
  for (const m of markers) {
    const [mx, my] = project(m.latlon);
    const dx = m.dx || 0;
    const dy = m.dy || 0;
    const onDark = m.onDark === true;
    const titleColor = onDark ? '#ffffff' : COLOR_TEXT;
    const subColor = onDark ? 'rgba(255,255,255,0.95)' : COLOR_TEXT_MUTED;
    const halo = onDark ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.92)';
    labelsSvg += `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif" text-anchor="middle" paint-order="stroke fill" stroke="${halo}" stroke-width="2.2" stroke-linejoin="round">
    <circle cx="${mx}" cy="${my}" r="4" fill="white" stroke="${TEAL_RAMP[5]}" stroke-width="2" />
    <text x="${mx + dx}" y="${my + dy + 20}" fill="${titleColor}" font-size="13" font-weight="600">${m.label}</text>
    <text x="${mx + dx}" y="${my + dy + 34}" fill="${subColor}" font-size="11" font-weight="500">${m.sub}</text>
  </g>\n`;
  }

  // Legend.
  const legendX = 36;
  const legendY = VIEW_H - 110;
  const legendBoxW = 220;
  const legendBoxH = 86;
  const swatchW = 26;
  const swatchH = 14;
  let legendSvg = `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif">
  <rect x="${legendX}" y="${legendY}" width="${legendBoxW}" height="${legendBoxH}" rx="10" ry="10" fill="white" stroke="#e2e8f0" stroke-width="1" />
  <text x="${legendX + 14}" y="${legendY + 22}" fill="${COLOR_TEXT}" font-size="12" font-weight="600" letter-spacing="0.05em">SEARCH VOLUME</text>
  <text x="${legendX + 14}" y="${legendY + 36}" fill="${COLOR_TEXT_MUTED}" font-size="10" font-weight="500">% of largest area · "dentist [area]"</text>
`;
  for (let i = 0; i < TEAL_RAMP.length; i++) {
    const sx = legendX + 14 + i * swatchW;
    legendSvg += `<rect x="${sx}" y="${legendY + 50}" width="${swatchW}" height="${swatchH}" fill="${TEAL_RAMP[i]}" />\n`;
  }
  legendSvg += `
  <text x="${legendX + 14}" y="${legendY + 78}" fill="${COLOR_TEXT_MUTED}" font-size="10" font-weight="500">low</text>
  <text x="${legendX + 14 + TEAL_RAMP.length * swatchW}" y="${legendY + 78}" text-anchor="end" fill="${COLOR_TEXT_MUTED}" font-size="10" font-weight="500">high</text>
</g>`;
  legendSvg += `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif" transform="translate(${legendX + legendBoxW + 12}, ${legendY})">
  <rect x="0" y="0" width="180" height="${legendBoxH}" rx="10" ry="10" fill="white" stroke="#e2e8f0" stroke-width="1" />
  <text x="14" y="22" fill="${COLOR_TEXT}" font-size="12" font-weight="600" letter-spacing="0.05em">OTHER FILLS</text>
  <rect x="14" y="32" width="18" height="14" fill="${COLOR_ZERO}" />
  <text x="38" y="44" fill="${COLOR_TEXT_MUTED}" font-size="11" font-weight="500">mapped, 0/mo</text>
  <rect x="14" y="52" width="18" height="14" fill="${COLOR_NO_DATA}" />
  <text x="38" y="64" fill="${COLOR_TEXT_MUTED}" font-size="11" font-weight="500">no data pulled</text>
</g>`;

  // Title and attribution.
  const titleSvg = `<g font-family="Outfit, sans-serif">
  <rect x="20" y="20" width="${titleCardWidth}" height="76" rx="12" ry="12" fill="rgba(255,255,255,0.92)" stroke="#e2e8f0" stroke-width="1" />
  <text x="36" y="52" fill="${COLOR_TEXT}" font-size="22" font-weight="700">${title}</text>
  <text x="36" y="78" fill="${COLOR_TEXT_MUTED}" font-size="13" font-weight="500" font-family="DM Sans, sans-serif">${subtitle}</text>
</g>`;

  const attribSvg = `<text x="${VIEW_W - 36}" y="${VIEW_H - 14}" text-anchor="end" font-family="DM Sans, sans-serif" font-size="10" fill="${COLOR_TEXT_MUTED}">${attribution}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label="${title}">
  <title>${title}</title>
  <desc>${subtitle}</desc>
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>
  <rect width="${VIEW_W}" height="${VIEW_H}" fill="${COLOR_WATER}" />
  <g filter="url(#softShadow)">
    ${pathsSvg}
  </g>
  ${labelsSvg}
  ${titleSvg}
  ${legendSvg}
  ${attribSvg}
</svg>
`;
  return { svg, viewW: VIEW_W, viewH: VIEW_H, groupCount: groups.size, featureCount: features.length };
}
