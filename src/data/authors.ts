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
      "Devon Bate is the co-founder and CEO of SEO Brothers, where he runs Partner Experience and Growth: the agency partners the team works with, and the systems that keep their campaigns measurable and improving. He and his brother Adam started the company in 2015; today it's a team of thirty plus, headquartered in Halifax.",
      "His lens has always been data first: measure what actually drives revenue, the leads and booked jobs, not vanity rankings. That's what he brings to the company's approach, and it's why the current chapter leans so hard on the software and reporting that make results faster and more transparent for the businesses it serves.",
      "He writes here about local SEO, multi-location search, and where search is heading, and co-hosts the Brothers in Search podcast with Adam.",
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
      "Adam Bate is the co-founder of SEO Brothers and the person who shaped how the company actually does SEO. Long before he and Devon started it in 2015, he was running his own hosting, web, and SEO businesses and working in-house at a high-end Calgary agency, so he came into SEO Brothers having already seen the field from nearly every angle. That's more than two decades of watching which tactics last and which ones quietly stop working.",
      "At SEO Brothers he sets the SEO strategy, leads sales and marketing, and as COO runs how the team actually functions and delivers the work. His writing leans on that long history: link building, on-page, keyword work, and the strategy guides that anchor the original SEO Brothers content. He co-hosts the Brothers in Search podcast with Devon.",
    ],
    photo: "/images/team/adam-bate.png",
    sameAs: ["https://ca.linkedin.com/in/adambate"],
    podcastHost: true,
    published: true,
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
