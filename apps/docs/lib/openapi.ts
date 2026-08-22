import { siteConfig } from "./config";

const errorSchema = {
  additionalProperties: false,
  properties: {
    error: {
      additionalProperties: false,
      properties: {
        code: {
          description: "Stable machine-readable error code.",
          examples: ["not_found", "method_not_allowed"],
          type: "string",
        },
        hint: {
          description: "Where an agent should look next.",
          type: "string",
        },
        message: {
          description: "Human-readable explanation.",
          type: "string",
        },
      },
      required: ["code", "message", "hint"],
      type: "object",
    },
  },
  required: ["error"],
  type: "object",
} as const;

export const openApiDocument = {
  components: {
    schemas: {
      ApiError: errorSchema,
    },
  },
  info: {
    contact: {
      name: "Liam Andrew",
      url: siteConfig.links.githubIssues,
    },
    description:
      "Public tetra-ui developer resources: the shadcn-compatible component registry, docs search index, OpenAPI document, and agent instruction files. This is a read-only HTTP API. There is no authentication, OAuth, webhooks, or write surface.",
    license: {
      identifier: "MIT",
      name: "MIT",
    },
    summary: "tetra-ui registry and documentation API",
    title: "tetra-ui Registry API",
    version: "1.0.0",
  },
  openapi: "3.1.0",
  paths: {
    "/api/search": {
      get: {
        description:
          "Static Orama search index used by the documentation site. Unknown /api paths return a JSON error.",
        operationId: "getSearchIndex",
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
            description: "Search index payload.",
          },
        },
        summary: "Documentation search index",
        tags: ["docs"],
      },
    },
    "/llms-full.txt": {
      get: {
        operationId: "getLlmsFull",
        responses: {
          "200": {
            content: {
              "text/plain": {
                schema: { type: "string" },
              },
            },
            description: "Extended tetra-ui reference for agents.",
          },
        },
        summary: "Full agent reference",
        tags: ["agents"],
      },
    },
    "/llms.txt": {
      get: {
        operationId: "getLlmsTxt",
        responses: {
          "200": {
            content: {
              "text/plain": {
                schema: { type: "string" },
              },
            },
            description: "Short tetra-ui instruction file for agents.",
          },
        },
        summary: "Agent instruction file",
        tags: ["agents"],
      },
    },
    "/openapi.json": {
      get: {
        operationId: "getOpenApi",
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
            description: "This OpenAPI document.",
          },
        },
        summary: "OpenAPI specification",
        tags: ["meta"],
      },
    },
    "/r/{name}.json": {
      get: {
        operationId: "getRegistryItem",
        parameters: [
          {
            description:
              "Registry item name, such as button or native-select. Matches the shadcn CLI argument after @tetra-ui/.",
            in: "path",
            name: "name",
            required: true,
            schema: {
              pattern: "^[a-z0-9-]+$",
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
            description: "shadcn-compatible registry item payload.",
          },
          "404": {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
            description: "Unknown registry item.",
          },
        },
        summary: "Component registry item",
        tags: ["registry"],
      },
    },
    "/r/registry.json": {
      get: {
        operationId: "getRegistryIndex",
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
            description: "Index of every published tetra-ui registry item.",
          },
        },
        summary: "Component registry index",
        tags: ["registry"],
      },
    },
  },
  servers: [
    {
      description: "Production",
      url: siteConfig.url,
    },
  ],
} as const;
