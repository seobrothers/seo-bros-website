/**
 * Hamilton choropleth: former-municipality polygons tinted by "dentist [area]"
 * Google Keyword Planner volumes (Canada targeting, May 2026).
 *
 * Source: City of Hamilton Open Data, Community_Boundaries FeatureServer.
 * Output: public/images/cities/hamilton-search-heatmap.svg
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderHeatmap } from './lib/heatmap-renderer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GEOJSON_PATH = '/tmp/hrm-data/hamilton-communities.geojson';
const OUTPUT_PATH = join(__dirname, '..', 'public', 'images', 'cities', 'hamilton-search-heatmap.svg');

const VOLUMES = {
  hamilton: 1900,         // dentists hamilton
  dundas: 1000,
  stoneyCreek: 720,
  ancaster: 390,
  hamiltonMountain: 210,  // sub-region of Hamilton, marker only
  flamborough: 0,
  glanbrook: 0,
};

// "Hamilton" polygon contains the lower city AND the Mountain. Mountain is a
// sub-region with its own keyword volume, surfaced as a marker, not a polygon.
const NAME_TO_KEY = {
  'Hamilton': 'hamilton',
  'Dundas': 'dundas',
  'Stoney Creek': 'stoneyCreek',
  'Ancaster': 'ancaster',
  'Flamborough': 'flamborough',
  'Glanbrook': 'glanbrook',
};

const LABEL_FOR_KEY = {
  hamilton: 'Hamilton',
  dundas: 'Dundas',
  stoneyCreek: 'Stoney Creek',
  ancaster: 'Ancaster',
  flamborough: 'Flamborough',
  glanbrook: 'Glanbrook',
};

const LABEL_OFFSETS = {
  hamilton: { dx: 0, dy: 0, anchor: 'middle' },
  dundas: { dx: -10, dy: -28, anchor: 'middle' },
  stoneyCreek: { dx: 0, dy: 0, anchor: 'middle' },
  ancaster: { dx: 0, dy: 0, anchor: 'middle' },
  flamborough: { dx: 0, dy: 0, anchor: 'middle' },
  glanbrook: { dx: 0, dy: 0, anchor: 'middle' },
};

const MARKERS = [
  {
    latlon: [-79.875, 43.222],
    label: 'Hamilton Mountain',
    sub: '210/mo · within Hamilton',
    onDark: true,  // sits on dark-teal Hamilton polygon
  },
];

const geojson = JSON.parse(readFileSync(GEOJSON_PATH, 'utf8'));
const result = renderHeatmap({
  geojson,
  nameField: 'COMMUNITY_NAME',
  volumes: VOLUMES,
  nameToKey: NAME_TO_KEY,
  labelForKey: LABEL_FOR_KEY,
  bbox: { minLon: -80.13, maxLon: -79.66, minLat: 43.13, maxLat: 43.46 },
  centerLat: 43.30,
  viewWidth: 1240,
  title: 'Where Hamilton dentist searches actually live',
  subtitle: 'Avg monthly Google searches for "dentist [area]" · Canada · Keyword Planner, May 2026',
  labelOffsets: LABEL_OFFSETS,
  markers: MARKERS,
  attribution: 'Boundaries: City of Hamilton Open Data · Volumes: Google Keyword Planner',
});

writeFileSync(OUTPUT_PATH, result.svg);
console.log(`Wrote ${OUTPUT_PATH} (${(result.svg.length / 1024).toFixed(1)} KB)`);
console.log(`viewBox: ${result.viewW} x ${Math.round(result.viewH)}`);
console.log(`Mapped ${result.groupCount} groups across ${result.featureCount} polygon features.`);
