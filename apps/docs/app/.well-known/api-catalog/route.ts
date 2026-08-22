import { siteConfig } from "@/lib/config";

export const GET = () => {
  return Response.json(
    {
      linkset: [
        {
          anchor: `${siteConfig.url}/`,
          "api-catalog": [
            {
              href: `${siteConfig.url}/openapi.json`,
              type: "application/openapi+json",
            },
          ],
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "Content-Type": "application/linkset+json; charset=utf-8",
      },
    }
  );
};
