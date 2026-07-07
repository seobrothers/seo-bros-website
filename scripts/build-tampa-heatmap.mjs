import { writeFileSync } from 'node:fs';

const RAMP = ['#cfeaee', '#9ed5dc', '#6dc0ca', '#33c4d1', '#28a5b1', '#1e8892'];
function color(pct) {
  if (pct >= 0.7) return RAMP[5];
  if (pct >= 0.45) return RAMP[4];
  if (pct >= 0.25) return RAMP[3];
  if (pct >= 0.1) return RAMP[2];
  if (pct >= 0.03) return RAMP[1];
  return RAMP[0];
}

const areas = [
  { name: 'Tampa', vol: 600 },
  { name: 'Clearwater', vol: 200 },
  { name: 'Brandon', vol: 100 },
  { name: 'Riverview', vol: 100 },
  { name: 'Largo', vol: 60 },
  { name: 'Wesley Chapel', vol: 50 },
  { name: 'St. Petersburg', vol: 20 },
];

const max = Math.max(...areas.map((a) => a.vol));
const barMax = 752;
let y = 132;
let rows = '';
for (const a of areas) {
  const pct = a.vol / max;
  const w = pct / 1 * barMax;
  const fill = color(pct);
  const dark = fill === RAMP[5]; // white text only on the darkest bar, matching orlando
  const textColor = dark ? '#ffffff' : '#0f172a';
  const pctStr = Math.round(pct * 100);
  rows += `      <g>
        <rect x="64" y="${y}" width="${w}" height="58" rx="10"
          fill="${fill}" stroke="#dbe5ea" stroke-width="0"/>
        <text x="82" y="${y + 35}" font-size="22" font-weight="700"
          fill="${textColor}" font-family="Georgia, serif">${a.name}</text>
        <text x="844" y="${y + 35}" font-size="19"
          fill="#64748b" font-family="-apple-system, Helvetica, Arial, sans-serif">${a.vol}/mo · ${pctStr}%</text>
      </g>\n`;
  y += 72;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 692" role="img" width="100%" height="auto">
  <rect x="0" y="0" width="1240" height="692" rx="20" fill="#ffffff" stroke="#e7eef2" stroke-width="1.5"/>
  <text x="64" y="58" font-size="34" font-weight="700" fill="#0f172a" font-family="Georgia, serif">Where Tampa HVAC searches actually live</text>
  <text x="64" y="92" font-size="19" fill="#64748b" font-family="-apple-system, Helvetica, Arial, sans-serif">Avg monthly Google searches for &quot;hvac [area]&quot; · US · Ahrefs, July 2026</text>
  <line x1="64" y1="110" x2="1176" y2="110" stroke="#eef2f6" stroke-width="1.5"/>

${rows}</svg>`;

writeFileSync('/Users/devonbate/Projects/seo-bros-website/public/images/cities/tampa-seo-search-heatmap.svg', svg);
console.log('wrote tampa svg, rows:', areas.length);
