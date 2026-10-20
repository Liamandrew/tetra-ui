import type { LayoutRectangle } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

type LayoutPosition = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

export type UseRelativePositionArgs = {
  align?: "start" | "center" | "end";
  avoidCollisions?: boolean;
  contentLayout: LayoutRectangle | null;
  alignOffset?: number;
  insets?: EdgeInsets;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  triggerPosition: LayoutPosition | null;
};

type PositionStyle = {
  position: "absolute";
  top: number;
  left: number;
  maxWidth?: number;
  maxHeight?: number;
  opacity?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const alignPosition = (
  start: number,
  triggerSize: number,
  contentSize: number,
  align: NonNullable<UseRelativePositionArgs["align"]>,
  offset: number
) => {
  const fraction = align === "start" ? 0 : align === "end" ? 1 : 0.5;
  return start + (triggerSize - contentSize) * fraction + offset;
};

/** Calculate once from measurements; the hook only supplies window dimensions. */
export function getRelativePosition({
  align = "start",
  avoidCollisions = true,
  triggerPosition: trigger,
  contentLayout: content,
  alignOffset = 0,
  insets,
  side = "bottom",
  sideOffset = 0,
  dimensions,
}: UseRelativePositionArgs & {
  dimensions: { width: number; height: number };
}): PositionStyle {
  if (!trigger) {
    return { left: -9999, opacity: 0, position: "absolute", top: -9999 };
  }
  if (!content) {
    return {
      left: trigger.pageX,
      opacity: 0,
      position: "absolute",
      top: trigger.pageY,
    };
  }

  const insetLeft = insets?.left ?? 0;
  const insetRight = insets?.right ?? 0;
  const insetTop = insets?.top ?? 0;
  const insetBottom = insets?.bottom ?? 0;
  const maxWidth = Math.max(0, dimensions.width - insetLeft - insetRight);
  const maxHeight = Math.max(0, dimensions.height - insetTop - insetBottom);
  const width = avoidCollisions
    ? Math.min(content.width, maxWidth)
    : content.width;
  const height = avoidCollisions
    ? Math.min(content.height, maxHeight)
    : content.height;

  let left: number;
  let top: number;
  if (side === "top" || side === "bottom") {
    left = alignPosition(
      trigger.pageX,
      trigger.width,
      width,
      align,
      alignOffset
    );
    top =
      side === "top"
        ? trigger.pageY - sideOffset - height
        : trigger.pageY + trigger.height + sideOffset;
  } else {
    top = alignPosition(
      trigger.pageY,
      trigger.height,
      height,
      align,
      alignOffset
    );
    left =
      side === "left"
        ? trigger.pageX - sideOffset - width
        : trigger.pageX + trigger.width + sideOffset;
  }

  if (!avoidCollisions) {
    return { left, position: "absolute", top };
  }

  return {
    left: clamp(left, insetLeft, dimensions.width - insetRight - width),
    maxHeight,
    maxWidth,
    position: "absolute",
    top: clamp(top, insetTop, dimensions.height - insetBottom - height),
  };
}
