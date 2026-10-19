import type { MetadataRoute } from "next";

/**
 * Serves `/robots.txt`. Crawlers are welcome on the overview pages: the Bibles list,
 * each Bible, and its books and chapters. The pages below those are generated from
 * API calls for every verse, passage, section and search, so they're kept out of crawls.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/bibles", "/bibles/*/books", "/bibles/*/books/*/chapters"],
      disallow: [
        "/bibles/*/verses/",
        "/bibles/*/passages/",
        "/bibles/*/sections/",
        "/bibles/*/search",
        "/bibles/*/chapters/*/verses",
        "/bibles/*/chapters/*/sections",
        "/bibles/*/books/*/sections",
      ],
    },
  };
}
