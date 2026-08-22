import { type NextRequest, NextResponse } from "next/server";
import { appendVaryAccept, isRscRequest, preferredType } from "@/lib/accept";

const SKIP_PREFIXES = [
  "/api/",
  "/r/",
  "/_next/",
  "/_vercel/",
  "/static/",
  "/previews/",
];

const SKIP_EXACT = new Set([
  "/openapi.json",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/favicon.ico",
  "/site.webmanifest",
]);

const STATIC_FILE = /\.[a-z0-9]+$/i;

const shouldNegotiate = (pathname: string): boolean => {
  if (SKIP_EXACT.has(pathname)) {
    return false;
  }
  for (const prefix of SKIP_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return false;
    }
  }
  if (STATIC_FILE.test(pathname) && !pathname.endsWith(".md")) {
    return false;
  }
  return true;
};

const rewriteMarkdown = (req: NextRequest, pathname: string): NextResponse => {
  const url = req.nextUrl.clone();
  url.pathname = `/api/markdown${pathname === "/" ? "" : pathname}`;
  const rewritten = NextResponse.rewrite(url);
  appendVaryAccept(rewritten.headers);
  rewritten.headers.set("Content-Type", "text/markdown; charset=utf-8");
  return rewritten;
};

export function proxy(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (!shouldNegotiate(pathname) || isRscRequest(req.headers)) {
    return NextResponse.next();
  }

  if (pathname.endsWith(".md")) {
    return rewriteMarkdown(req, pathname.slice(0, -3) || "/");
  }

  const chosen = preferredType(req.headers.get("accept"));

  if (chosen === "text/markdown") {
    return rewriteMarkdown(req, pathname);
  }

  if (chosen === null && req.headers.get("accept")) {
    return new NextResponse(
      "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept, Accept-Encoding",
        },
        status: 406,
      }
    );
  }

  const res = NextResponse.next();
  appendVaryAccept(res.headers);
  return res;
}

export const config = {
  matcher: ["/((?!api/|_next/|_vercel/).*)"],
};
