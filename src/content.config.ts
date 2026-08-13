import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(["partner", "campaign"]),
    publishDate: z.date(),
    featured: z.boolean().default(false),
    redacted: z.boolean().default(true),
    // Keeps a case study out of the prod build, listing, and sitemap until
    // it's approved (mirrors the guides collection).
    draft: z.boolean().default(false),

    subject: z.string(),
    vertical: z.string().optional(),
    region: z.string().optional(),

    summary: z.string(),

    headlineMetric: z.object({
      value: z.string(),
      label: z.string(),
    }),

    secondaryMetrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .default([]),

    timeframe: z.string().optional(),

    agencySize: z.string().optional(),
    pullQuote: z
      .object({
        text: z.string(),
        attribution: z.string(),
      })
      .optional(),

    keyTactics: z.array(z.string()).default([]),
    charts: z
      .array(
        z.object({
          kind: z.enum(["bars", "line"]).default("line"),
          yLabel: z.string().optional(),
          xAxis: z.array(z.string()),
          series: z.array(
            z.object({
              label: z.string(),
              values: z.array(z.number()),
            })
          ),
        })
      )
      .default([]),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["seo", "industry", "agency", "cities"]),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    summary: z.string(),
    author: z.string().default("Adam Bate"),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    showToc: z.boolean().default(true),
    showAuditCta: z.boolean().default(false),
  }),
});

// Blog posts: dated, first-person pieces (data write-ups, building in public,
// observations from client work) served at /blog/{id}/. Distinct from guides,
// which are evergreen how-tos. Devon's voice is the default byline.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    summary: z.string(),
    author: z.string().default("Devon Bate"),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    showToc: z.boolean().default(true),
  }),
});

export const collections = { caseStudies, guides, blog };
