import { MARKDOWN_VARY } from "@/lib/accept";
import { resolveMarkdown } from "@/lib/resolve-markdown";

type RouteContext = {
  params: Promise<{
    slug?: string[];
  }>;
};

const markdownResponse = async (params: RouteContext["params"]) => {
  const { slug = [] } = await params;
  const pathname = slug.length === 0 ? "/" : `/${slug.join("/")}`;
  const result = resolveMarkdown(pathname);

  return new Response(result.body, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=86400",
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: MARKDOWN_VARY,
    },
    status: result.status,
  });
};

export const GET = (_req: Request, context: RouteContext) => {
  return markdownResponse(context.params);
};

export const HEAD = async (_req: Request, context: RouteContext) => {
  const response = await markdownResponse(context.params);
  return new Response(null, {
    headers: response.headers,
    status: response.status,
  });
};
