import { siteConfig } from "./config";

export type ContentBlock = {
  body: string;
  title: string;
};

export type SitePageContent = {
  description: string;
  path: string;
  sections: ContentBlock[];
  title: string;
};

const absolute = (path: string): string => {
  if (path.startsWith("http")) {
    return path;
  }
  return `${siteConfig.url}${path}`;
};

export const homePage: SitePageContent = {
  description: siteConfig.description,
  path: "/",
  sections: [],
  title: "Delightful Components for React Native",
};

export const notFoundPage: SitePageContent = {
  description: "Go build one that does.",
  path: "/404",
  sections: [
    {
      body: `This URL is not part of tetra-ui. Agents should recover from the sitemap at ${absolute(siteConfig.links.sitemap)}, the instruction file at ${absolute(siteConfig.links.llms)}, the docs index at ${absolute(siteConfig.links.docs)}, or the OpenAPI description at ${absolute(siteConfig.links.openapi)}.`,
      title: "Where to look next",
    },
  ],
  title: "This screen does not exist",
};

export const marketingPages = [homePage] as const;

export const pageByPath = new Map<string, SitePageContent>(
  marketingPages.map((page) => [page.path, page])
);

export const plainTextFromPage = (page: SitePageContent): string => {
  const parts = [page.title, page.description];
  for (const section of page.sections) {
    parts.push(section.title, section.body);
  }
  return parts.join(" ");
};

export const markdownFromPage = (page: SitePageContent): string => {
  const lines = [`# ${page.title}`, "", page.description];
  for (const section of page.sections) {
    lines.push("", `## ${section.title}`, "", section.body);
  }
  return `${lines.join("\n")}\n`;
};
