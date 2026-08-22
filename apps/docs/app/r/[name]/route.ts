import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { apiErrorCodes, jsonErrorResponse } from "@/lib/api-error";
import { parseRegistryName } from "@/lib/registry-name";

const REGISTRY_DIR = path.join(process.cwd(), "public/r");

type RouteContext = {
  params: Promise<{
    name: string;
  }>;
};

const missingItem = (name: string) => {
  return jsonErrorResponse(
    404,
    apiErrorCodes.notFound,
    `No tetra-ui registry item named '${name}'.`,
    "List published items at /r/registry.json or read /openapi.json."
  );
};

export const GET = async (_req: Request, context: RouteContext) => {
  const { name: raw } = await context.params;
  const name = parseRegistryName(raw);
  if (!name) {
    return missingItem(raw);
  }

  const filePath = path.join(REGISTRY_DIR, `${name}.json`);
  if (!existsSync(filePath)) {
    return missingItem(name);
  }

  return new Response(readFileSync(filePath, "utf8"), {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export const POST = () => {
  return jsonErrorResponse(
    405,
    apiErrorCodes.methodNotAllowed,
    "The tetra-ui registry is read-only.",
    "Use GET /r/{name}.json or install with npx shadcn@latest add @tetra-ui/{name}."
  );
};
