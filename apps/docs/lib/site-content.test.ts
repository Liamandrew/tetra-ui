import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { homePage, markdownFromPage, notFoundPage } from "./site-content";

describe("homepage content", () => {
  it("keeps the original hero title and description", () => {
    const markdown = markdownFromPage(homePage);
    assert.ok(markdown.startsWith("# Delightful Components for React Native"));
    assert.ok(homePage.description.includes("React Native"));
  });
});

describe("not found markdown", () => {
  it("points agents at the sitemap, llms.txt, and docs", () => {
    const markdown = markdownFromPage(notFoundPage);
    assert.ok(markdown.startsWith("# This screen does not exist"));
    assert.ok(markdown.includes("sitemap.xml"));
    assert.ok(markdown.includes("llms.txt"));
    assert.ok(markdown.includes("/docs"));
  });
});
