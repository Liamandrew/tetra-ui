import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseRegistryName } from "./registry-name";

describe("parseRegistryName", () => {
  it("accepts item names with or without a .json suffix", () => {
    assert.equal(parseRegistryName("button"), "button");
    assert.equal(parseRegistryName("button.json"), "button");
    assert.equal(parseRegistryName("native-select.json"), "native-select");
  });

  it("rejects path traversal and empty names", () => {
    assert.equal(parseRegistryName("../secret"), null);
    assert.equal(parseRegistryName(""), null);
    assert.equal(parseRegistryName("Button.json"), null);
  });
});
