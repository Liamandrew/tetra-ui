import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { mergeRefs } from "../../../packages/tetra-ui/src/lib/utils";

describe("mergeRefs", () => {
  it("matches the utility consumers copy from the installation guide", () => {
    const implementation = readFileSync(
      new URL("../../../packages/tetra-ui/src/lib/utils.ts", import.meta.url),
      "utf8"
    ).trim();
    const installation = readFileSync(
      new URL(
        "../content/docs/(getting-started)/installation.mdx",
        import.meta.url
      ),
      "utf8"
    );
    assert.ok(installation.includes(implementation));
  });

  it("attaches and clears object refs and legacy callback refs", () => {
    const node = { focus: () => undefined };
    const objectRef = { current: null as typeof node | null };
    const received: (typeof node | null)[] = [];
    const ref = mergeRefs(objectRef, (value) => {
      received.push(value);
    });

    const cleanup = ref(node);
    assert.equal(objectRef.current, node);
    assert.deepEqual(received, [node]);
    assert.equal(typeof cleanup, "function");
    cleanup();
    assert.equal(objectRef.current, null);
    assert.deepEqual(received, [node, null]);
  });

  it("preserves React 19 callback cleanups without also calling them with null", () => {
    const node = {};
    const calls: string[] = [];
    const ref = mergeRefs<typeof node>(undefined, (value) => {
      assert.equal(value, node);
      calls.push("attach");
      return () => {
        calls.push("cleanup");
      };
    });

    const cleanup = ref(node);
    assert.equal(typeof cleanup, "function");
    cleanup();
    assert.deepEqual(calls, ["attach", "cleanup"]);
  });
});
