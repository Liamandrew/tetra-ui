import { apiErrorCodes, jsonErrorResponse } from "@/lib/api-error";

const unknownApi = (req: Request) => {
  const url = new URL(req.url);
  return jsonErrorResponse(
    404,
    apiErrorCodes.notFound,
    `No tetra-ui API endpoint at ${url.pathname}.`,
    "See /openapi.json for the tetra-ui Registry API, or /llms.txt for agent instructions."
  );
};

export const GET = unknownApi;
export const HEAD = unknownApi;
export const POST = unknownApi;
export const PUT = unknownApi;
export const PATCH = unknownApi;
export const DELETE = unknownApi;
