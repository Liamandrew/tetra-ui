import { openApiDocument } from "@/lib/openapi";

export const GET = () => {
  return Response.json(openApiDocument, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Content-Type": "application/openapi+json; charset=utf-8",
    },
  });
};
