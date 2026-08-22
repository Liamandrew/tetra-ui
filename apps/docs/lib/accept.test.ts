import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appendVaryAccept, preferredType } from "./accept";

describe("preferredType", () => {
  it("defaults to HTML when Accept is missing", () => {
    assert.equal(preferredType(null), "text/html");
  });

  it("prefers markdown when it is listed first", () => {
    assert.equal(
      preferredType("text/markdown, text/html;q=0.8"),
      "text/markdown"
    );
  });

  it("prefers HTML for a typical browser Accept header", () => {
    assert.equal(
      preferredType(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      ),
      "text/html"
    );
  });

  it("honors q-values so a higher-q HTML wins", () => {
    assert.equal(
      preferredType("text/markdown;q=0.1, text/html;q=0.9"),
      "text/html"
    );
  });

  it("treats an explicit q=0 as a rejection", () => {
    assert.equal(preferredType("text/html;q=0, */*;q=1"), "text/markdown");
  });

  it("returns null when the client rejects every produced type", () => {
    assert.equal(preferredType("application/pdf"), null);
  });
});

describe("appendVaryAccept", () => {
  it("sets Accept and Accept-Encoding when Vary is empty", () => {
    const headers = new Headers();
    appendVaryAccept(headers);
    assert.equal(headers.get("Vary"), "Accept, Accept-Encoding");
  });

  it("appends Accept without duplicating an existing token", () => {
    const headers = new Headers({ Vary: "Accept-Encoding" });
    appendVaryAccept(headers);
    assert.equal(headers.get("Vary"), "Accept-Encoding, Accept");
  });
});
