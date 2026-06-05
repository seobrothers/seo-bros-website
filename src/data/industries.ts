// Industries We Serve — single source of truth for the /industries/ section.
//
// Each entry maps an existing industry-category guide (the long-form markdown
// in src/content/guides/) to a clean /industries/{slug}/ URL, a display name,
// and a grouping for the hub page. The renderer (src/pages/industries/[slug].astro),
// the hub (src/pages/industries/index.astro), and the sitemap all read from
// this list, so adding/removing a vertical happens in one place.
//
// When you add an entry here, also add a 301 from the old /guides/{guideId}/
// URL to /industries/{slug}/ in public/_redirects.
//
// `featured` marks the home-services / local verticals that lead the hub and
// are the focus for paid acquisition.

export interface IndustryMeta {
  /** The guide markdown id in src/content/guides/ (filename without .md). */
  guideId: string;
  /** Clean URL slug under /industries/. */
  slug: string;
  /** Display name, e.g. "HVAC". */
  name: string;
  /** Hub grouping. */
  group: "Home & Local Services" | "Health & Wellness" | "Professional & Specialty";
  /** Home-services / local verticals that lead the hub and paid focus. */
  featured?: boolean;
}

export const INDUSTRIES: IndustryMeta[] = [
  // Home & Local Services — the direct-to-business / paid focus.
  { guideId: "home-services-seo", slug: "home-services", name: "Home Services", group: "Home & Local Services", featured: true },
  { guideId: "hvac-seo", slug: "hvac", name: "HVAC", group: "Home & Local Services", featured: true },
  { guideId: "seo-for-plumbers", slug: "plumbing", name: "Plumbing", group: "Home & Local Services", featured: true },
  { guideId: "tree-service-seo", slug: "tree-service", name: "Tree Service", group: "Home & Local Services", featured: true },
  { guideId: "carpet-cleaning-seo", slug: "carpet-cleaning", name: "Carpet Cleaning", group: "Home & Local Services", featured: true },
  { guideId: "auto-repair-seo", slug: "auto-repair", name: "Auto Repair", group: "Home & Local Services", featured: true },
  { guideId: "home-builder-seo", slug: "home-builders", name: "Home Builders", group: "Home & Local Services" },
  { guideId: "property-management-seo", slug: "property-management", name: "Property Management", group: "Home & Local Services" },

  // Health & Wellness.
  { guideId: "dental-seo", slug: "dental", name: "Dental", group: "Health & Wellness" },
  { guideId: "orthodontist-seo", slug: "orthodontics", name: "Orthodontics", group: "Health & Wellness" },
  { guideId: "medspa-seo", slug: "medspa", name: "Med Spa", group: "Health & Wellness" },
  { guideId: "plastic-surgery-seo", slug: "plastic-surgery", name: "Plastic Surgery", group: "Health & Wellness" },
  { guideId: "acupuncture-seo", slug: "acupuncture", name: "Acupuncture", group: "Health & Wellness" },
  { guideId: "audiology-seo", slug: "audiology", name: "Audiology", group: "Health & Wellness" },

  // Professional & Specialty.
  { guideId: "legal-services-seo", slug: "legal", name: "Legal", group: "Professional & Specialty" },
  { guideId: "financial-services-seo", slug: "financial-services", name: "Financial Services", group: "Professional & Specialty" },
  { guideId: "funeral-home-seo", slug: "funeral-homes", name: "Funeral Homes", group: "Professional & Specialty" },
  { guideId: "cannabis-seo", slug: "cannabis", name: "Cannabis", group: "Professional & Specialty" },
  { guideId: "franchise-seo", slug: "franchise", name: "Franchise & Multi-Location", group: "Professional & Specialty" },
];

/** Order the hub groups render in. */
export const INDUSTRY_GROUPS: IndustryMeta["group"][] = [
  "Home & Local Services",
  "Health & Wellness",
  "Professional & Specialty",
];

const bySlug = new Map(INDUSTRIES.map((i) => [i.slug, i]));
const byGuideId = new Map(INDUSTRIES.map((i) => [i.guideId, i]));

export function industryBySlug(slug: string): IndustryMeta | undefined {
  return bySlug.get(slug);
}

export function industryByGuideId(guideId: string): IndustryMeta | undefined {
  return byGuideId.get(guideId);
}
