import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { marketingPages } from "./site-content";

const DOCS_DIR = path.join(process.cwd(), "content/docs");
const MDX_EXT = /\.mdx$/;
const PAREN_GROUP = /\([^/]+\)\//g;
const TRAILING_INDEX = /\/index$/;
const ONLY_INDEX = /^index$/;

export const mdxFileToDocsUrl = (relativePath: string): string => {
  const withoutExt = relativePath.replace(MDX_EXT, "");
  const withoutGroups = withoutExt.replace(PAREN_GROUP, "");
  const withoutIndex = withoutGroups
    .replace(TRAILING_INDEX, "")
    .replace(ONLY_INDEX, "");
  if (withoutIndex === "") {
    return "/docs";
  }
  return `/docs/${withoutIndex}`;
};

const walkMdxFiles = (dir: string, base = dir): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMdxFiles(fullPath, base));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(path.relative(base, fullPath));
    }
  }

  return files;
};

export type SitemapEntry = {
  lastModified: Date;
  url: string;
};

export const getIndexableUrls = (docsDir = DOCS_DIR): SitemapEntry[] => {
  const entries: SitemapEntry[] = marketingPages.map((page) => ({
    lastModified: new Date(),
    url: page.path,
  }));

  for (const relativePath of walkMdxFiles(docsDir)) {
    const fullPath = path.join(docsDir, relativePath);
    entries.push({
      lastModified: statSync(fullPath).mtime,
      url: mdxFileToDocsUrl(relativePath.split(path.sep).join("/")),
    });
  }

  const seen = new Set<string>();
  const unique: SitemapEntry[] = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) {
      continue;
    }
    seen.add(entry.url);
    unique.push(entry);
  }

  return unique;
};
