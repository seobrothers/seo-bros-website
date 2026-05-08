/**
 * Renders a choropleth SVG map of HRM's community plan areas, tinted by
 * "dentist [area]" Google Keyword Planner volumes (Canada targeting, May 2026).
 *
 * Source GeoJSON: HRM Open Data, Community Plan Areas (publicly licensed).
 * Output: public/images/cities/halifax-search-heatmap.svg
 *
 * Usage: node scripts/build-halifax-heatmap.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GEOJSON_PATH = '/tmp/hrm-data/community-plan-areas.geojson';
const OUTPUT_PATH = join(__dirname, '..', 'public', 'images', 'cities', 'halifax-search-heatmap.svg');

// Keyword volumes (avg monthly searches, "dentist [area]", Canada, May 2026).
// `null` = no data (rural/unmapped). PLAN_NAMEs map onto these keys.
const VOLUMES = {
  halifax: 1900,
  bedford: 880,
  dartmouth: 720,
  sackville: 140,
  hammondsPlains: 90,
  coleHarbour: 30,
  easternPassage: 0,
};

const SPRYFIELD_NOTE = { volume: 110, label: 'Spryfield', subLabel: '(within Halifax)' };

// HRM PLAN_NAME -> volumes key. Multiple plan areas can share the same key.
const PLAN_TO_KEY = {
  'Halifax': 'halifax',
  'Downtown Halifax': 'halifax',
  'Regional Centre': 'halifax',
  'Bedford': 'bedford',
  'Dartmouth': 'dartmouth',
  'Sackville': 'sackville',
  'Sackville Drive': 'sackville',
  'Beaver Bank, Hammonds Plains and Upper Sackville': 'hammondsPlains',
  'Cole Harbour/Westphal': 'coleHarbour',
  'Eastern Passage/Cow Bay': 'easternPassage',
};

// Display labels for the legend / map labels (don't show all sub-areas).
const LABEL_FOR_KEY = {
  halifax: 'Halifax',
  bedford: 'Bedford',
  dartmouth: 'Dartmouth',
  sackville: 'Sackville',
  hammondsPlains: 'Hammonds Plains',
  coleHarbour: 'Cole Harbour',
  easternPassage: 'Eastern Passage',
};

// Brand-aligned teal heat ramp (light -> dark = low -> high).
const TEAL_RAMP = ['#cfeaee', '#9ed5dc', '#6dc0ca', '#33c4d1', '#28a5b1', '#1e8892'];
const COLOR_NO_DATA = '#eef2f6';   // rural / unmapped land
const COLOR_ZERO = '#dbe5ea';      // mapped but zero volume
const COLOR_WATER = '#eef5f8';     // bg
const COLOR_LAND_STROKE = '#ffffff';
const COLOR_TEXT = '#0f172a';
const COLOR_TEXT_MUTED = '#64748b';

function colorForVolume(vol, max) {
  if (vol === null || vol === undefined) return COLOR_NO_DATA;
  if (vol === 0) return COLOR_ZERO;
  const pct = vol / max;
  // Quantile-ish bins so small values still show some color.
  if (pct >= 0.7) return TEAL_RAMP[5];
  if (pct >= 0.45) return TEAL_RAMP[4];
  if (pct >= 0.25) return TEAL_RAMP[3];
  if (pct >= 0.1) return TEAL_RAMP[2];
  if (pct >= 0.03) return TEAL_RAMP[1];
  return TEAL_RAMP[0];
}

// Whether a fill from our palette is dark enough to need light text on top.
function isDarkFill(fill) {
  return fill === TEAL_RAMP[5] || fill === TEAL_RAMP[4] || fill === TEAL_RAMP[3];
}

// Mercator-ish projection. For a region this small the simple equirectangular
// scaled by cos(centerLat) is visually indistinguishable from real Mercator.
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

// Drop points within MIN_PX of the previous kept point. At viewBox 1240px wide
// across ~36km of HRM, ~1px ≈ 30m on the ground — well below visual resolution.
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
  // Always keep the last point (closes ring back to start in valid GeoJSON).
  kept.push(projected[projected.length - 1]);
  return kept
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ') + ' Z';
}

function geometryToPath(geom, project) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  return polys.map((poly) => poly.map((ring) => ringToPath(ring, project)).join(' ')).join(' ');
}

// Polygon centroid (signed-area weighted; for MultiPolygons we use the largest ring).
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
function geometryCentroid(geom) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  let best = null;
  let bestArea = -Infinity;
  for (const poly of polys) {
    const ring = poly[0];
    const a = Math.abs(ringArea(ring));
    if (a > bestArea) { bestArea = a; best = ring; }
  }
  return ringCentroid(best);
}

// --- main ---
const raw = JSON.parse(readFileSync(GEOJSON_PATH, 'utf8'));

// Build keyed feature list with matched volume (or null for unmapped/rural).
const features = raw.features.map((f) => {
  const planName = f.properties.PLAN_NAME;
  const key = PLAN_TO_KEY[planName] || null;
  const volume = key ? VOLUMES[key] : null;
  return { feature: f, planName, key, volume };
});

const maxVolume = Math.max(...Object.values(VOLUMES));

// Cropping bbox: HRM's urban core (peninsula + Bedford + Sackville + Dartmouth + Cole
// Harbour + Hammonds Plains + Eastern Passage). Anything outside is the rural HRM
// land we render in light gray as context.
const URBAN_BBOX = { minLon: -63.86, maxLon: -63.38, minLat: 44.55, maxLat: 44.83 };
const VIEW_W = 1240;
const VIEW_H = (URBAN_BBOX.maxLat - URBAN_BBOX.minLat) /
               ((URBAN_BBOX.maxLon - URBAN_BBOX.minLon) * Math.cos(44.7 * Math.PI / 180))
               * VIEW_W;
const project = makeProjection({ width: VIEW_W, height: VIEW_H }, URBAN_BBOX, 44.7);

// Group features by key so we can label each grouped region once at the centroid
// of the largest polygon in the group.
const groups = new Map();
for (const ent of features) {
  if (!ent.key) continue;
  if (!groups.has(ent.key)) groups.set(ent.key, []);
  groups.get(ent.key).push(ent);
}

// Compute label anchors at the centroid of the biggest polygon per group.
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

// Render order: rural/unmapped first (background), then mapped areas on top.
const orderedFeatures = [...features].sort((a, b) => {
  const av = a.volume ?? -1;
  const bv = b.volume ?? -1;
  return av - bv;
});

let pathsSvg = '';
for (const { feature: f, volume } of orderedFeatures) {
  const fill = colorForVolume(volume, maxVolume);
  const path = geometryToPath(f.geometry, project);
  pathsSvg += `<path d="${path}" fill="${fill}" stroke="${COLOR_LAND_STROKE}" stroke-width="0.7" stroke-linejoin="round" />\n`;
}

// --- labels with optional callouts ---
// For very small polygons (Eastern Passage, Cole Harbour), nudge labels with a
// short leader line. Manual offsets keep this readable.
const LABEL_OFFSETS = {
  halifax: { dx: -10, dy: 30, anchor: 'middle' },
  bedford: { dx: 0, dy: 0, anchor: 'middle' },
  dartmouth: { dx: 0, dy: 8, anchor: 'middle' },
  sackville: { dx: 0, dy: 0, anchor: 'middle' },
  hammondsPlains: { dx: 0, dy: 0, anchor: 'middle' },
  coleHarbour: { dx: 22, dy: 0, anchor: 'start' },
  easternPassage: { dx: 18, dy: 18, anchor: 'start' },
};

let labelsSvg = '';
for (const [key, [lon, lat]] of labelAnchors.entries()) {
  const [cx, cy] = project([lon, lat]);
  const off = LABEL_OFFSETS[key] || { dx: 0, dy: 0, anchor: 'middle' };
  const tx = cx + off.dx;
  const ty = cy + off.dy;
  const vol = VOLUMES[key];
  const label = LABEL_FOR_KEY[key];
  const volStr = vol === 0 ? '0' : vol.toLocaleString('en-US');
  const pctOfMax = vol === 0 ? 0 : Math.round((vol / maxVolume) * 100);
  const subStr = vol === 0 ? 'no commercial volume' : `${volStr}/mo · ${pctOfMax}%`;
  const fill = colorForVolume(vol, maxVolume);
  const onDark = isDarkFill(fill) && Math.abs(off.dx) + Math.abs(off.dy) === 0;
  const titleColor = onDark ? '#ffffff' : COLOR_TEXT;
  const subColor = onDark ? 'rgba(255,255,255,0.95)' : COLOR_TEXT_MUTED;
  const halo = onDark ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.92)';
  // Leader line for offset labels.
  if (Math.abs(off.dx) + Math.abs(off.dy) > 0) {
    const leadEndX = off.anchor === 'start' ? tx - 4 : (off.anchor === 'end' ? tx + 4 : tx);
    labelsSvg += `<line x1="${cx}" y1="${cy}" x2="${leadEndX}" y2="${ty - 6}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" />\n`;
  }
  // Subtle stroke "halo" via paint-order so labels stay legible across boundaries.
  labelsSvg += `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif" text-anchor="${off.anchor}" paint-order="stroke fill" stroke="${halo}" stroke-width="2.2" stroke-linejoin="round">
    <text x="${tx}" y="${ty - 4}" fill="${titleColor}" font-size="16" font-weight="600">${label}</text>
    <text x="${tx}" y="${ty + 13}" fill="${subColor}" font-size="12" font-weight="500">${subStr}</text>
  </g>\n`;
}

// Spryfield is a sub-neighbourhood of the Halifax plan area, not its own polygon.
// Hand-anchored point so it shows on the map without claiming its own region.
const SPRYFIELD_LATLON = [-63.6125, 44.6175];
const [spx, spy] = project(SPRYFIELD_LATLON);
labelsSvg += `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif" text-anchor="middle" paint-order="stroke fill" stroke="rgba(15,23,42,0.55)" stroke-width="2.2" stroke-linejoin="round">
  <circle cx="${spx}" cy="${spy}" r="4" fill="white" stroke="${TEAL_RAMP[5]}" stroke-width="2" />
  <text x="${spx}" y="${spy + 20}" fill="#ffffff" font-size="13" font-weight="600">Spryfield</text>
  <text x="${spx}" y="${spy + 34}" fill="rgba(255,255,255,0.85)" font-size="11" font-weight="500">110/mo · within Halifax</text>
</g>\n`;

// --- legend ---
const legendX = 36;
const legendY = VIEW_H - 110;
const legendBoxW = 220;
const legendBoxH = 86;
const swatchW = 26;
const swatchH = 14;
const swatchGap = 0;

let legendSvg = `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif">
  <rect x="${legendX}" y="${legendY}" width="${legendBoxW}" height="${legendBoxH}" rx="10" ry="10" fill="white" stroke="#e2e8f0" stroke-width="1" />
  <text x="${legendX + 14}" y="${legendY + 22}" fill="${COLOR_TEXT}" font-size="12" font-weight="600" letter-spacing="0.05em">SEARCH VOLUME</text>
  <text x="${legendX + 14}" y="${legendY + 36}" fill="${COLOR_TEXT_MUTED}" font-size="10" font-weight="500">% of largest area · "dentist [area]"</text>
`;
for (let i = 0; i < TEAL_RAMP.length; i++) {
  const sx = legendX + 14 + i * (swatchW + swatchGap);
  legendSvg += `<rect x="${sx}" y="${legendY + 50}" width="${swatchW}" height="${swatchH}" fill="${TEAL_RAMP[i]}" />\n`;
}
legendSvg += `
  <text x="${legendX + 14}" y="${legendY + 78}" fill="${COLOR_TEXT_MUTED}" font-size="10" font-weight="500">low</text>
  <text x="${legendX + 14 + TEAL_RAMP.length * swatchW}" y="${legendY + 78}" text-anchor="end" fill="${COLOR_TEXT_MUTED}" font-size="10" font-weight="500">high</text>
</g>`;

// "no data" swatch beneath the legend
legendSvg += `<g font-family="Outfit, 'DM Sans', system-ui, sans-serif" transform="translate(${legendX + legendBoxW + 12}, ${legendY})">
  <rect x="0" y="0" width="170" height="${legendBoxH}" rx="10" ry="10" fill="white" stroke="#e2e8f0" stroke-width="1" />
  <text x="14" y="22" fill="${COLOR_TEXT}" font-size="12" font-weight="600" letter-spacing="0.05em">OTHER FILLS</text>
  <rect x="14" y="32" width="18" height="14" fill="${COLOR_ZERO}" />
  <text x="38" y="44" fill="${COLOR_TEXT_MUTED}" font-size="11" font-weight="500">mapped, 0/mo</text>
  <rect x="14" y="52" width="18" height="14" fill="${COLOR_NO_DATA}" />
  <text x="38" y="64" fill="${COLOR_TEXT_MUTED}" font-size="11" font-weight="500">rural HRM, no data</text>
</g>`;

// --- title and attribution ---
// Title sits in a soft white card pinned to the top edge so the polygons can't
// run over it. Width is hand-tuned to fit the longest line without dwarfing
// the map.
const titleSvg = `<g font-family="Outfit, sans-serif">
  <rect x="20" y="20" width="800" height="76" rx="12" ry="12" fill="rgba(255,255,255,0.92)" stroke="#e2e8f0" stroke-width="1" />
  <text x="36" y="52" fill="${COLOR_TEXT}" font-size="22" font-weight="700">Where Halifax dentist searches actually live</text>
  <text x="36" y="78" fill="${COLOR_TEXT_MUTED}" font-size="13" font-weight="500" font-family="DM Sans, sans-serif">Avg monthly Google searches for "dentist [area]" · Canada · Keyword Planner, May 2026</text>
</g>`;

const attribSvg = `<text x="${VIEW_W - 36}" y="${VIEW_H - 14}" text-anchor="end" font-family="DM Sans, sans-serif" font-size="10" fill="${COLOR_TEXT_MUTED}">Boundaries: HRM Open Data · Volumes: Google Keyword Planner</text>`;

// --- compose ---
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label="Halifax dentist search heatmap by community">
  <title>Halifax dentist search heatmap</title>
  <desc>Choropleth of HRM community plan areas tinted by avg monthly Google searches for "dentist [area]". Halifax 1,900; Bedford 880; Dartmouth 720; Sackville 140; Spryfield 110; Hammonds Plains 90; Cole Harbour 30; Eastern Passage 0.</desc>
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

writeFileSync(OUTPUT_PATH, svg);
console.log(`Wrote ${OUTPUT_PATH} (${(svg.length / 1024).toFixed(1)} KB)`);
console.log(`viewBox: ${VIEW_W} x ${Math.round(VIEW_H)}`);
console.log(`Mapped ${groups.size} groups across ${[...groups.values()].flat().length} plan-area features.`);
