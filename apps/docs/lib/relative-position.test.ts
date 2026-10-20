import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getRelativePosition } from "../../../packages/tetra-ui/src/lib/relative-position";

const fixture = {
  contentLayout: { height: 100, width: 120, x: 0, y: 0 },
  dimensions: { height: 600, width: 320 },
  insets: { bottom: 20, left: 12, right: 12, top: 30 },
  triggerPosition: { height: 40, pageX: 100, pageY: 200, width: 80 },
};

describe("relative positioning", () => {
  it("places content on each side with offsets", () => {
    for (const [side, top, left] of [
      ["bottom", 248, 80],
      ["top", 92, 80],
      ["left", 170, -28],
      ["right", 170, 188],
    ] as const) {
      const position = getRelativePosition({
        ...fixture,
        align: "center",
        avoidCollisions: false,
        side,
        sideOffset: 8,
      });
      assert.equal(position.top, top);
      assert.equal(position.left, left);
    }
  });

  it("does not constrain alignment when collision avoidance is disabled", () => {
    const position = getRelativePosition({
      ...fixture,
      align: "end",
      alignOffset: -10,
      avoidCollisions: false,
      triggerPosition: { ...fixture.triggerPosition, pageX: 0 },
    });
    assert.equal(position.left, -50);
    assert.equal(position.maxWidth, undefined);
    assert.equal(position.maxHeight, undefined);
  });

  it("keeps oversized content within safe-area insets on every side", () => {
    for (const side of ["top", "bottom", "left", "right"] as const) {
      const position = getRelativePosition({
        ...fixture,
        contentLayout: { height: 900, width: 500, x: 0, y: 0 },
        side,
      });
      assert.equal(position.left, 12);
      assert.equal(position.top, 30);
      assert.equal(position.maxWidth, 296);
      assert.equal(position.maxHeight, 550);
    }
  });

  it("honors start and end alignment on horizontal sides", () => {
    assert.equal(
      getRelativePosition({ ...fixture, align: "start", side: "right" }).top,
      200
    );
    assert.equal(
      getRelativePosition({ ...fixture, align: "end", side: "right" }).top,
      140
    );
  });

  it("hides content until both measurements are available", () => {
    assert.equal(
      getRelativePosition({ ...fixture, triggerPosition: null }).opacity,
      0
    );
    assert.equal(
      getRelativePosition({ ...fixture, contentLayout: null }).opacity,
      0
    );
  });
});
