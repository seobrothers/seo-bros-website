// Authors registry.
//
// Single source of truth for guide bylines, the /authors/[slug]/ pages, and
// the podcast host cards. To add a team member as a creditable author:
//
//   1. Add an entry below. `name` MUST match the guide frontmatter `author:`
//      string exactly (that's how bylines find the author page).
//   2. Drop a square headshot at the `photo` path (see src/pages/about.astro
//      for the existing team images).
//   3. Set `published: true` once the bio is approved and `sameAs` links are in.
//
// Until `published` is true, the author's page is generated but noindexed, the
// byline stays plain text (no link), and the page is kept out of the sitemap.
// That lets a draft author be previewed without leaking unfinished pages.

export interface Author {
  slug: string;
  /** Must equal the guide frontmatter `author:` string exactly. */
  name: string;
  /** Short role label shown under the name. */
  role: string;
  /** schema.org Person jobTitle. */
  jobTitle: string;
  /** Bio paragraphs, in order. */
  bio: string[];
  /** Square headshot, e.g. /images/team/devon-bate.png */
  photo: string;
  /** Profile URLs for schema.org sameAs (LinkedIn, X, etc.). */
  sameAs: string[];
  /** Co-host of the Brothers in Search podcast. */
  podcastHost?: boolean;
  /** Gate: false keeps the page noindexed, unlinked, and out of the sitemap. */
  published: boolean;
}

export const authors: Author[] = [
  {
    slug: "devon-bate",
    name: "Devon Bate",
    role: "Founder & CEO",
    jobTitle: "Founder & CEO",
    bio: [
      "Devon Bate is the co-founder and CEO of SEO Brothers. He came to SEO from a finance and consulting background, and from day one in 2015 he was the one doing the work, the company's first and only SEO specialist while he and his brother Adam built it from nothing.",
      "Today he leads the company's technology-first chapter, focused on the software and process that make SEO work faster and more transparent for the agency partners SEO Brothers serves. He writes here about local SEO, industry verticals, and where search is heading, and co-hosts the Brothers in Search podcast with Adam.",
    ],
    photo: "/images/team/devon-bate.png",
    sameAs: ["https://www.linkedin.com/in/devonbate/"],
    podcastHost: true,
    published: true,
  },
  {
    slug: "adam-bate",
    name: "Adam Bate",
    role: "Founder & COO",
    jobTitle: "Founder & COO",
    bio: [
      "Adam Bate is the co-founder and COO of SEO Brothers, with more than twenty years in online marketing and SEO. He has lived through enough algorithm updates to have strong opinions about which tactics last and which ones quietly stop working, and he is the operational backbone of the company.",
      "His writing leans on that long history: link building, on-page, keyword work, and the strategy guides that anchor the original SEO Brothers content. He co-hosts the Brothers in Search podcast with Devon.",
    ],
    photo: "/images/team/adam-bate.png",
    sameAs: ["https://www.linkedin.com/in/adambate/"],
    podcastHost: true,
    published: false, // flip to true once Adam approves his bio
  },
];

const byName = new Map(authors.map((a) => [a.name, a]));
const bySlug = new Map(authors.map((a) => [a.slug, a]));

/** Look up an author by their exact display name (the guide `author:` string). */
export function authorByName(name: string): Author | undefined {
  return byName.get(name);
}

/** Look up an author by URL slug. */
export function authorBySlug(slug: string): Author | undefined {
  return bySlug.get(slug);
}

/** Published authors only (for the sitemap and any public index). */
export function publishedAuthors(): Author[] {
  return authors.filter((a) => a.published);
}
