// Regional clusters for the city guides. Drives the NearbyCities cross-link
// block on each city guide and the region directory on /guides/cities/.
// `id` must match the guide's content id (filename without extension); URL is
// /guides/{id}/. When a new city guide ships, add it to its region here and
// both the mesh and the directory update automatically.
import type { GuideGroup } from "./guideGroups";

export interface RegionCity {
  id: string;
  label: string;
}

export interface Region {
  name: string;
  cities: RegionCity[];
}

export const CITY_REGIONS: Region[] = [
  {
    name: "Western Canada",
    cities: [
      { id: "calgary-seo", label: "Calgary" },
      { id: "edmonton-seo", label: "Edmonton" },
      { id: "kelowna-seo", label: "Kelowna" },
      { id: "vancouver-seo", label: "Vancouver" },
      { id: "victoria-seo", label: "Victoria" },
      { id: "winnipeg-seo", label: "Winnipeg" },
    ],
  },
  {
    name: "Eastern Canada",
    cities: [
      { id: "halifax-seo", label: "Halifax" },
      { id: "hamilton-seo", label: "Hamilton" },
      { id: "kitchener-waterloo-seo", label: "Kitchener-Waterloo" },
      { id: "mississauga-seo", label: "Mississauga" },
      { id: "montreal-seo", label: "Montreal" },
      { id: "ottawa-seo", label: "Ottawa" },
      { id: "toronto-seo", label: "Toronto" },
    ],
  },
  {
    name: "Texas",
    cities: [
      { id: "austin-seo", label: "Austin" },
      { id: "dallas-seo", label: "Dallas" },
      { id: "fort-worth-seo", label: "Fort Worth" },
      { id: "houston-seo", label: "Houston" },
      { id: "san-antonio-seo", label: "San Antonio" },
    ],
  },
  {
    name: "Florida",
    cities: [
      { id: "fort-lauderdale-seo", label: "Fort Lauderdale" },
      { id: "jacksonville-seo", label: "Jacksonville" },
      { id: "orlando-seo", label: "Orlando" },
      { id: "tampa-seo", label: "Tampa" },
    ],
  },
  {
    name: "the Southeast",
    cities: [
      { id: "atlanta-seo", label: "Atlanta" },
      { id: "baton-rouge-seo", label: "Baton Rouge" },
      { id: "birmingham-seo", label: "Birmingham" },
      { id: "charlotte-seo", label: "Charlotte" },
      { id: "nashville-seo", label: "Nashville" },
      { id: "new-orleans-seo", label: "New Orleans" },
      { id: "raleigh-seo", label: "Raleigh" },
      { id: "richmond-seo", label: "Richmond" },
    ],
  },
  {
    name: "the Great Lakes",
    cities: [
      { id: "cincinnati-seo", label: "Cincinnati" },
      { id: "cleveland-seo", label: "Cleveland" },
      { id: "columbus-seo", label: "Columbus" },
      { id: "detroit-seo", label: "Detroit" },
      { id: "grand-rapids-seo", label: "Grand Rapids" },
      { id: "indianapolis-seo", label: "Indianapolis" },
      { id: "madison-seo", label: "Madison" },
      { id: "milwaukee-seo", label: "Milwaukee" },
    ],
  },
  {
    name: "the Plains",
    cities: [
      { id: "des-moines-seo", label: "Des Moines" },
      { id: "kansas-city-seo", label: "Kansas City" },
      { id: "oklahoma-city-seo", label: "Oklahoma City" },
      { id: "omaha-seo", label: "Omaha" },
      { id: "st-louis-seo", label: "St. Louis" },
    ],
  },
  {
    name: "the Mountain West and Southwest",
    cities: [
      { id: "colorado-springs-seo", label: "Colorado Springs" },
      { id: "denver-seo", label: "Denver" },
      { id: "las-vegas-seo", label: "Las Vegas" },
      { id: "phoenix-seo", label: "Phoenix" },
      { id: "salt-lake-city-seo", label: "Salt Lake City" },
      { id: "tucson-seo", label: "Tucson" },
    ],
  },
  {
    name: "the Northeast",
    cities: [
      { id: "buffalo-seo", label: "Buffalo" },
      { id: "pittsburgh-seo", label: "Pittsburgh" },
      { id: "rochester-seo", label: "Rochester" },
    ],
  },
  {
    name: "the West Coast",
    cities: [
      { id: "sacramento-seo", label: "Sacramento" },
      { id: "seattle-seo", label: "Seattle" },
      { id: "spokane-seo", label: "Spokane" },
    ],
  },
];

export function regionForCity(guideId: string): Region | undefined {
  return CITY_REGIONS.find((r) => r.cities.some((c) => c.id === guideId));
}

// The same regions as GuideList groups, so /guides/cities/ renders as a
// region-by-region directory. Region names are written for prose ("in the
// Southeast"), so strip the article for headings.
export const CITY_GUIDE_GROUPS: GuideGroup[] = CITY_REGIONS.map((r) => ({
  title: r.name.replace(/^the /, ""),
  ids: r.cities.map((c) => c.id),
}));
