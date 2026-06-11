// Topic groupings for the SEO and Agency guide hubs, so the guides render
// organized under headings (Technical SEO, Local SEO, etc.) instead of one
// long chronological list. GuideList reads these via its `groups` prop.
//
// Any guide in the category that isn't listed here falls into a "More" group
// at the end, so nothing is ever dropped — but keep these current as guides
// are added.

export interface GuideGroup {
  title: string;
  /** Short context line shown under the heading, above the cards. */
  blurb?: string;
  ids: string[];
}

export const GUIDE_GROUPS: Record<string, GuideGroup[]> = {
  seo: [
    {
      title: "Local SEO",
      blurb:
        "For most service businesses this is the whole ballgame: the map pack and “near me” searches that turn into calls.",
      ids: ["local-seo"],
    },
    {
      title: "Technical SEO",
      blurb:
        "The plumbing. Crawlability, page speed, and the Core Web Vitals Google actually measures. If search engines can't read your site fast, nothing else matters.",
      ids: [
        "on-page-seo",
        "seo-audit",
        "interaction-to-next-paint",
        "seo-for-wordpress",
        "website-redesign-seo",
        "sitebulb-review",
      ],
    },
    {
      title: "Content & Keywords",
      blurb:
        "Targeting the right searches and building pages that answer them better than the competition. Not about volume, about covering what brings in customers.",
      ids: ["keyword-research", "keyword-mapping", "searcher-intent", "what-to-blog-about", "multimedia-seo"],
    },
    {
      title: "AI Search",
      blurb:
        "How you show up as more people start their search with AI Overviews, ChatGPT, and Perplexity. The fundamentals still apply; how you get cited is shifting.",
      ids: ["ai-seo", "google-search-generative-experience", "serp-features-evolution", "ai-data-center-batteries"],
    },
    {
      title: "Link Building",
      blurb:
        "Earning the authority other sites pass you, without the shortcuts that get sites penalized.",
      ids: ["link-building", "private-blog-networks", "google-disavow-tool", "white-hat-seo"],
    },
  ],
  agency: [
    {
      title: "Selling SEO",
      blurb:
        "Where most SEO is won or lost: the pitch, the report-review call, and framing scope and price so deals close.",
      ids: ["how-to-sell-seo-services"],
    },
    {
      title: "Delivering Under Your Brand",
      blurb:
        "White-label work that holds up in front of your client, so the deliverables carry your name and never ours.",
      ids: ["white-label-seo-audits", "white-label-seo-reporting"],
    },
  ],
};
