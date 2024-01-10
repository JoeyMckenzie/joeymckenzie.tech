import { allPosts } from "contentlayer/generated";
import { MetadataRoute } from "next";

type SitemapMetadata = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteMapEntriesForPosts = allPosts.map(
    (p) =>
      ({
        url: `https://joeymckenzie.tech/blog/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      }) satisfies SitemapMetadata,
  );

  return [
    {
      url: "https://joeymckenzie.tech",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://joeymckenzie.tech/now",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://joeymckenzie.tech/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...siteMapEntriesForPosts,
  ];
}
