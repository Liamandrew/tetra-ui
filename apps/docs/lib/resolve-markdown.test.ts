import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePathname, resolveMarkdown } from "./resolve-markdown";

describe("normalizePathname", () => {
  it("strips a .md sibling suffix and trailing slashes", () => {
    assert.equal(normalizePathname("/docs.md"), "/docs");
    assert.equal(normalizePathname("/docs/"), "/docs");
    assert.equal(normalizePathname("/"), "/");
  });
});

describe("resolveMarkdown", () => {
  it("serves homepage markdown for the site root", () => {
    const result = resolveMarkdown("/");
    assert.equal(result.status, 200);
    assert.ok(
      result.body.startsWith("# Delightful Components for React Native")
    );
  });

  it("serves docs markdown from MDX sources", () => {
    const result = resolveMarkdown("/docs/components/button");
    assert.equal(result.status, 200);
    assert.ok(result.body.includes("Button"));
  });

  it("returns 404 markdown with recovery links for unknown paths", () => {
    const result = resolveMarkdown("/some-path-that-does-not-exist");
    assert.equal(result.status, 404);
    assert.ok(result.body.includes("llms.txt"));
    assert.ok(result.body.includes("sitemap.xml"));
  });
});
