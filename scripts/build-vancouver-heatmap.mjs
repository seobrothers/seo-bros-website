/**
 * Metro Vancouver choropleth: municipal polygons tinted by "dentist [area]"
 * Google Keyword Planner volumes (Canada targeting, May 2026).
 *
 * Source: Metro Vancouver Open Data, GVRD_Administrative_Boundaries FeatureServer.
 * Output: public/images/cities/vancouver-search-heatmap.svg
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderHeatmap } from './lib/heatmap-renderer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GEOJSON_PATH = '/tmp/hrm-data/vancouver-municipalities.geojson';
const OUTPUT_PATH = join(__dirname, '..', 'public', 'images', 'cities', 'vancouver-search-heatmap.svg');

const VOLUMES = {
  vancouver: 2900,
  surrey: 2400,
  langley: 2400,           // city + township share keyword bucket
  newWestminster: 2400,
  coquitlam: 1300,
  burnaby: 1600,
  northVancouver: 1300,    // city + district share keyword bucket
  mapleRidge: 1000,
  pittMeadows: 880,
  richmond: 480,
  portCoquitlam: 480,
  portMoody: 480,
  westVancouver: 390,
  whiteRock: 320,
  delta: 70,
};

// Multiple polygons can map to the same key (e.g. Langley city + Langley township).
const NAME_TO_KEY = {
  'Vancouver': 'vancouver',
  'Surrey': 'surrey',
  'Langley City': 'langley',
  'Langley Township': 'langley',
  'New Westminster': 'newWestminster',
  'Coquitlam': 'coquitlam',
  'Burnaby': 'burnaby',
  'North Vancouver City': 'northVancouver',
  'North Vancouver District': 'northVancouver',
  'Maple Ridge': 'mapleRidge',
  'Pitt Meadows': 'pittMeadows',
  'Richmond': 'richmond',
  'Port Coquitlam': 'portCoquitlam',
  'Port Moody': 'portMoody',
  'West Vancouver': 'westVancouver',
  'White Rock': 'whiteRock',
  'Delta': 'delta',
  // Anmore, Belcarra, Lions Bay, Bowen Island, Tsawwassen FN: left unmapped (gray).
};

const LABEL_FOR_KEY = {
  vancouver: 'Vancouver',
  surrey: 'Surrey',
  langley: 'Langley',
  newWestminster: 'New West.',
  coquitlam: 'Coquitlam',
  burnaby: 'Burnaby',
  northVancouver: 'North Van',
  mapleRidge: 'Maple Ridge',
  pittMeadows: 'Pitt Meadows',
  richmond: 'Richmond',
  portCoquitlam: 'Port Coquitlam',
  portMoody: 'Port Moody',
  westVancouver: 'West Van',
  whiteRock: 'White Rock',
  delta: 'Delta',
};

// Hand-tuned offsets for tightly packed municipalities to keep labels off
// adjacent polygons.
const LABEL_OFFSETS = {
  vancouver: { dx: 0, dy: 0, anchor: 'middle' },
  surrey: { dx: 0, dy: 0, anchor: 'middle' },
  langley: { dx: 0, dy: 0, anchor: 'middle' },
  newWestminster: { dx: 80, dy: 30, anchor: 'start' },     // small polygon, leader off
  coquitlam: { dx: 0, dy: 0, anchor: 'middle' },
  burnaby: { dx: 0, dy: 0, anchor: 'middle' },
  northVancouver: { dx: 0, dy: 0, anchor: 'middle' },
  mapleRidge: { dx: 0, dy: 0, anchor: 'middle' },
  pittMeadows: { dx: 0, dy: 0, anchor: 'middle' },
  richmond: { dx: 0, dy: 0, anchor: 'middle' },
  portCoquitlam: { dx: 80, dy: -10, anchor: 'start' },     // leader to small polygon
  portMoody: { dx: -90, dy: 10, anchor: 'end' },           // leader to small polygon
  westVancouver: { dx: 0, dy: 0, anchor: 'middle' },
  whiteRock: { dx: 80, dy: 30, anchor: 'start' },          // tiny polygon, leader off
  delta: { dx: 0, dy: 0, anchor: 'middle' },
};

const MARKERS = [
  // Kitsilano: Vancouver west-side neighbourhood, real sub-area volume.
  {
    latlon: [-123.165, 49.272],
    label: 'Kitsilano',
    sub: '260/mo',
    onDark: true,
    dy: -8,
  },
  // Gastown: downtown Vancouver historic district. Tiny volume but noteworthy.
  {
    latlon: [-123.107, 49.284],
    label: 'Gastown',
    sub: '40/mo',
    onDark: true,
    dx: 30,
    dy: 8,
  },
];

const geojson = JSON.parse(readFileSync(GEOJSON_PATH, 'utf8'));
const result = renderHeatmap({
  geojson,
  nameField: 'ShortName',
  volumes: VOLUMES,
  nameToKey: NAME_TO_KEY,
  labelForKey: LABEL_FOR_KEY,
  // Crop to the urban core: Vancouver, North/West Van, Burnaby/Coquitlam/PoCo/PoMo,
  // Richmond, Surrey/Langley/New West/Delta/White Rock, Maple Ridge/Pitt Meadows.
  // Excludes Bowen Island, Lions Bay, Anmore, Belcarra at the periphery.
  bbox: { minLon: -123.30, maxLon: -122.40, minLat: 49.00, maxLat: 49.42 },
  centerLat: 49.21,
  viewWidth: 1500,
  title: 'Where Metro Vancouver dentist searches actually live',
  subtitle: 'Avg monthly Google searches for "dentist [area]" · Canada · Keyword Planner, May 2026',
  labelOffsets: LABEL_OFFSETS,
  markers: MARKERS,
  titleCardWidth: 880,
  attribution: 'Boundaries: Metro Vancouver Open Data · Volumes: Google Keyword Planner',
});

writeFileSync(OUTPUT_PATH, result.svg);
console.log(`Wrote ${OUTPUT_PATH} (${(result.svg.length / 1024).toFixed(1)} KB)`);
console.log(`viewBox: ${result.viewW} x ${Math.round(result.viewH)}`);
console.log(`Mapped ${result.groupCount} groups across ${result.featureCount} polygon features.`);
