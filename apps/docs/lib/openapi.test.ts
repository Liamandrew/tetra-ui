import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { openApiDocument } from "./openapi";

describe("openApiDocument", () => {
  it("is an OpenAPI 3.1 document for the tetra-ui registry API", () => {
    assert.equal(openApiDocument.openapi, "3.1.0");
    assert.ok(openApiDocument.info.title.toLowerCase().includes("tetra-ui"));
    assert.ok(openApiDocument.paths["/openapi.json"]);
    assert.ok(openApiDocument.paths["/r/registry.json"]);
    assert.ok(openApiDocument.paths["/r/{name}.json"]);
    assert.ok(openApiDocument.paths["/r/{name}.json"].get.responses["404"]);
    assert.ok(openApiDocument.components.schemas.ApiError);
  });
});
