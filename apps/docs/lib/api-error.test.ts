import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiErrorBody, apiErrorCodes, jsonErrorResponse } from "./api-error";

describe("apiErrorBody", () => {
  it("returns a structured error agents can parse", () => {
    const body = apiErrorBody(
      apiErrorCodes.notFound,
      "No registry item named 'missing'.",
      "List available items at /r/registry.json or see /openapi.json"
    );

    assert.deepEqual(body, {
      error: {
        code: "not_found",
        hint: "List available items at /r/registry.json or see /openapi.json",
        message: "No registry item named 'missing'.",
      },
    });
  });
});

describe("jsonErrorResponse", () => {
  it("returns JSON with a 404 status and Vary: Accept", async () => {
    const response = jsonErrorResponse(
      404,
      apiErrorCodes.notFound,
      "Unknown API path.",
      "See /openapi.json for the tetra-ui Registry API."
    );

    assert.equal(response.status, 404);
    assert.ok(
      (response.headers.get("content-type") ?? "").includes("application/json")
    );
    assert.ok(
      (response.headers.get("vary") ?? "").toLowerCase().includes("accept")
    );

    const payload = await response.json();
    assert.equal(payload.error.code, "not_found");
    assert.equal(typeof payload.error.message, "string");
    assert.equal(typeof payload.error.hint, "string");
  });
});
