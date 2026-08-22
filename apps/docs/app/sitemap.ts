import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getIndexableUrls } from "@/lib/sitemap-urls";

export default function sitemap(): MetadataRoute.Sitemap {
  return getIndexableUrls().map((entry) => ({
    lastModified: entry.lastModified,
    url: `${siteConfig.url}${entry.url === "/" ? "" : entry.url}`,
  }));
}
