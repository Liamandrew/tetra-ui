import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { markdownFromPage, notFoundPage, pageByPath } from "./site-content";

const DOCS_DIR = path.join(process.cwd(), "content/docs");
const TRAILING_SLASHES = /\/+$/;

export type MarkdownResult = {
  body: string;
  status: number;
};

export const normalizePathname = (pathname: string): string => {
  const withoutMd = pathname.endsWith(".md") ? pathname.slice(0, -3) : pathname;
  if (withoutMd === "" || withoutMd === "/") {
    return "/";
  }
  return withoutMd.replace(TRAILING_SLASHES, "");
};

const docsUrlToCandidates = (pathname: string): string[] => {
  if (pathname === "/docs") {
    return [
      path.join(DOCS_DIR, "(getting-started)", "index.mdx"),
      path.join(DOCS_DIR, "index.mdx"),
    ];
  }

  if (!pathname.startsWith("/docs/")) {
    return [];
  }

  const slug = pathname.slice("/docs/".length);
  return [
    path.join(DOCS_DIR, `${slug}.mdx`),
    path.join(DOCS_DIR, slug, "index.mdx"),
    path.join(DOCS_DIR, "(getting-started)", `${slug}.mdx`),
    path.join(DOCS_DIR, "components", `${path.basename(slug)}.mdx`),
  ];
};

const readFirstExisting = (candidates: string[]): string | null => {
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFileSync(candidate, "utf8");
    }
  }
  return null;
};

export const resolveMarkdown = (pathname: string): MarkdownResult => {
  const clean = normalizePathname(pathname);
  const page = pageByPath.get(clean);
  if (page) {
    return {
      body: markdownFromPage(page),
      status: 200,
    };
  }

  const docsMarkdown = readFirstExisting(docsUrlToCandidates(clean));
  if (docsMarkdown) {
    return {
      body: docsMarkdown,
      status: 200,
    };
  }

  return {
    body: markdownFromPage(notFoundPage),
    status: 404,
  };
};
