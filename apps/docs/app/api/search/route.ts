import { createFromSource } from "fumadocs-core/search/server";
import { apiErrorCodes, jsonErrorResponse } from "@/lib/api-error";
import { source } from "@/lib/source";

export const revalidate = false;

const { staticGET } = createFromSource(source, {
  language: "english",
});

export const GET = async () => {
  try {
    return await staticGET();
  } catch {
    return jsonErrorResponse(
      500,
      "search_unavailable",
      "The tetra-ui documentation search index could not be loaded.",
      "Retry later or browse https://tetra-ui.com/docs and https://tetra-ui.com/openapi.json."
    );
  }
};

export const POST = () => {
  return jsonErrorResponse(
    405,
    apiErrorCodes.methodNotAllowed,
    "Documentation search is read-only.",
    "Use GET /api/search or see /openapi.json."
  );
};
