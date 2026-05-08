/**
 * Kitchener-Waterloo / Region of Waterloo choropleth.
 *
 * Source: Region of Waterloo Open Data, Municipal_Boundary FeatureServer.
 * Output: public/images/cities/kitchener-waterloo-search-heatmap.svg
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderHeatmap } from './lib/heatmap-renderer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GEOJSON_PATH = '/tmp/hrm-data/kw-municipalities.geojson';
const OUTPUT_PATH = join(__dirname, '..', 'public', 'images', 'cities', 'kitchener-waterloo-search-heatmap.svg');

const VOLUMES = {
  kitchener: 2400,
  waterloo: 1600,
  cambridge: 110,        // dentist cambridge ontario, dramatically smaller than plumber 590
  // Townships have no direct dentist data; named places inside them surface as markers.
  newHamburg: 320,       // within Wilmot
  ayr: 260,              // within North Dumfries
  elmira: 210,           // within Woolwich
  wellesleyVillage: 20,  // within Wellesley Township
  breslau: 0,            // within Woolwich, fast-growing but no commercial volume yet
  // No data for the townships themselves -> rendered as "no data".
};

const NAME_TO_KEY = {
  'KITCHENER': 'kitchener',
  'WATERLOO': 'waterloo',
  'CAMBRIDGE': 'cambridge',
};

const LABEL_FOR_KEY = {
  kitchener: 'Kitchener',
  waterloo: 'Waterloo',
  cambridge: 'Cambridge',
  newHamburg: 'New Hamburg',
  ayr: 'Ayr',
  elmira: 'Elmira',
  wellesleyVillage: 'Wellesley',
  breslau: 'Breslau',
};

const LABEL_OFFSETS = {
  kitchener: { dx: 0, dy: 0, anchor: 'middle' },
  waterloo: { dx: 0, dy: -10, anchor: 'middle' },
  cambridge: { dx: 0, dy: 0, anchor: 'middle' },
};

const MARKERS = [
  // New Hamburg: main town in Wilmot, west of Kitchener. Real volume.
  {
    latlon: [-80.700, 43.378],
    label: 'New Hamburg',
    sub: '320/mo · in Wilmot',
  },
  // Ayr: in North Dumfries, south of Cambridge.
  {
    latlon: [-80.452, 43.282],
    label: 'Ayr',
    sub: '260/mo · in North Dumfries',
  },
  // Elmira: in Woolwich, north of Waterloo.
  {
    latlon: [-80.557, 43.598],
    label: 'Elmira',
    sub: '210/mo · in Woolwich',
  },
  // Wellesley village: tiny but non-zero, in Wellesley Township.
  {
    latlon: [-80.762, 43.475],
    label: 'Wellesley',
    sub: '20/mo · in Wellesley Twp.',
  },
  // Breslau: in Woolwich, just east of Kitchener. Growing community, zero volume.
  {
    latlon: [-80.435, 43.485],
    label: 'Breslau',
    sub: '0/mo · in Woolwich',
  },
];

const geojson = JSON.parse(readFileSync(GEOJSON_PATH, 'utf8'));
const result = renderHeatmap({
  geojson,
  nameField: 'MUNICIPALITY',
  volumes: VOLUMES,
  nameToKey: NAME_TO_KEY,
  labelForKey: LABEL_FOR_KEY,
  // Region of Waterloo extents.
  bbox: { minLon: -80.78, maxLon: -80.18, minLat: 43.18, maxLat: 43.71 },
  centerLat: 43.45,
  viewWidth: 1240,
  title: 'Where KW dentist searches actually live',
  subtitle: 'Avg monthly Google searches for "dentist [area]" · Canada · Keyword Planner, May 2026',
  labelOffsets: LABEL_OFFSETS,
  markers: MARKERS,
  attribution: 'Boundaries: Region of Waterloo Open Data · Volumes: Google Keyword Planner',
});

writeFileSync(OUTPUT_PATH, result.svg);
console.log(`Wrote ${OUTPUT_PATH} (${(result.svg.length / 1024).toFixed(1)} KB)`);
console.log(`viewBox: ${result.viewW} x ${Math.round(result.viewH)}`);
console.log(`Mapped ${result.groupCount} groups across ${result.featureCount} polygon features.`);
