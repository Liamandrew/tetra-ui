import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { getIndexableUrls, mdxFileToDocsUrl } from "./sitemap-urls";

describe("mdxFileToDocsUrl", () => {
  it("maps grouped and index files onto /docs URLs", () => {
    assert.equal(mdxFileToDocsUrl("(getting-started)/index.mdx"), "/docs");
    assert.equal(
      mdxFileToDocsUrl("(getting-started)/installation.mdx"),
      "/docs/installation"
    );
    assert.equal(
      mdxFileToDocsUrl("components/button.mdx"),
      "/docs/components/button"
    );
  });
});

describe("getIndexableUrls", () => {
  it("includes marketing pages and discovered docs with lastmod dates", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "tetra-ui-sitemap-"));
    mkdirSync(path.join(dir, "(getting-started)"), { recursive: true });
    writeFileSync(
      path.join(dir, "(getting-started)", "index.mdx"),
      "# Intro\n"
    );
    writeFileSync(path.join(dir, "button.mdx"), "# Button\n");

    const urls = getIndexableUrls(dir);
    const paths = urls.map((entry) => entry.url);

    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/docs"));
    assert.ok(paths.includes("/docs/button"));
    assert.ok(urls.every((entry) => entry.lastModified instanceof Date));
  });
});
