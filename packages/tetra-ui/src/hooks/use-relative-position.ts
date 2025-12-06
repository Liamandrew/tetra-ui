import { useMemo } from "react";
import {
  Dimensions,
  type LayoutRectangle,
  type ScaledSize,
} from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

type LayoutPosition = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

type UseRelativePositionArgs = {
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
  top?: number;
  left?: number;
  maxWidth?: number;
  maxHeight?: number;
  opacity?: number;
};

type SidePositionParams = {
  side: "top" | "bottom" | "left" | "right";
  triggerPosition: LayoutPosition;
  contentLayout: LayoutRectangle;
  sideOffset: number;
  insets?: EdgeInsets;
  avoidCollisions: boolean;
  dimensions: ScaledSize;
};

function getVerticalSidePosition({
  side,
  triggerPosition,
  contentLayout,
  sideOffset,
  insetTop,
  insetBottom,
  avoidCollisions,
  dimensions,
}: {
  side: "top" | "bottom";
  triggerPosition: LayoutPosition;
  contentLayout: LayoutRectangle;
  sideOffset: number;
  insetTop: number;
  insetBottom: number;
  avoidCollisions: boolean;
  dimensions: ScaledSize;
}): { top?: number } {
  const positionTop = triggerPosition.pageY - sideOffset - contentLayout.height;
  const positionBottom =
    triggerPosition.pageY + triggerPosition.height + sideOffset;

  if (!avoidCollisions) {
    return {
      top: side === "top" ? positionTop : positionBottom,
    };
  }

  if (side === "top") {
    return {
      top: Math.min(
        Math.max(insetTop, positionTop),
        dimensions.height - insetBottom - contentLayout.height
      ),
    };
  }

  // For bottom placement, match reference implementation exactly
  return {
    top: Math.min(
      dimensions.height - insetBottom - contentLayout.height,
      positionBottom
    ),
  };
}

function getHorizontalSidePosition({
  side,
  triggerPosition,
  contentLayout,
  sideOffset,
  insetLeft,
  insetRight,
  avoidCollisions,
  dimensions,
}: {
  side: "left" | "right";
  triggerPosition: LayoutPosition;
  contentLayout: LayoutRectangle;
  sideOffset: number;
  insetLeft: number;
  insetRight: number;
  avoidCollisions: boolean;
  dimensions: ScaledSize;
}): { left?: number } {
  const maxContentWidth = dimensions.width - insetLeft - insetRight;
  const contentWidth = Math.min(contentLayout.width, maxContentWidth);

  const positionLeft = triggerPosition.pageX - sideOffset - contentWidth;
  const positionRight =
    triggerPosition.pageX + triggerPosition.width + sideOffset;

  if (!avoidCollisions) {
    return {
      left: side === "left" ? positionLeft : positionRight,
    };
  }

  const minLeft = insetLeft;
  const maxLeft = dimensions.width - insetRight - contentWidth;

  if (side === "left") {
    return {
      left: Math.max(minLeft, Math.min(maxLeft, positionLeft)),
    };
  }

  return {
    left: Math.max(minLeft, Math.min(maxLeft, positionRight)),
  };
}

function getSidePosition({
  side = "bottom",
  triggerPosition,
  contentLayout,
  sideOffset = 0,
  insets,
  avoidCollisions = true,
  dimensions,
}: SidePositionParams): { top?: number; left?: number } {
  const insetTop = insets?.top ?? 0;
  const insetBottom = insets?.bottom ?? 0;
  const insetLeft = insets?.left ?? 0;
  const insetRight = insets?.right ?? 0;

  // Handle vertical sides (top/bottom)
  if (side === "top" || side === "bottom") {
    return getVerticalSidePosition({
      side,
      triggerPosition,
      contentLayout,
      sideOffset,
      insetTop,
      insetBottom,
      avoidCollisions,
      dimensions,
    });
  }

  // Handle horizontal sides (left/right)
  return getHorizontalSidePosition({
    side,
    triggerPosition,
    contentLayout,
    sideOffset,
    insetLeft,
    insetRight,
    avoidCollisions,
    dimensions,
  });
}

type HorizontalAlignParams = {
  align: "start" | "center" | "end";
  triggerPageX: number;
  triggerWidth: number;
  contentWidth: number;
  alignOffset: number;
  insetLeft: number;
  insetRight: number;
  dimensions: ScaledSize;
};

function getHorizontalAlignPosition({
  align,
  triggerPageX,
  triggerWidth,
  contentWidth,
  alignOffset,
  insetLeft,
  insetRight,
  dimensions,
}: HorizontalAlignParams): number {
  let left = 0;
  if (align === "start") {
    left = triggerPageX;
  }
  if (align === "center") {
    left = triggerPageX + triggerWidth / 2 - contentWidth / 2;
  }
  if (align === "end") {
    left = triggerPageX + triggerWidth - contentWidth;
  }
  return Math.max(
    insetLeft,
    Math.min(left + alignOffset, dimensions.width - contentWidth - insetRight)
  );
}

type VerticalAlignParams = {
  align: "start" | "center" | "end";
  triggerPageY: number;
  triggerHeight: number;
  contentHeight: number;
  alignOffset: number;
  insetTop: number;
  insetBottom: number;
  dimensions: ScaledSize;
};

function getVerticalAlignPosition({
  align,
  triggerPageY,
  triggerHeight,
  contentHeight,
  alignOffset,
  insetTop,
  insetBottom,
  dimensions,
}: VerticalAlignParams): number {
  let top = 0;
  if (align === "start") {
    top = triggerPageY;
  }
  if (align === "center") {
    top = triggerPageY + triggerHeight / 2 - contentHeight / 2;
  }
  if (align === "end") {
    top = triggerPageY + triggerHeight - contentHeight;
  }
  return Math.max(
    insetTop,
    Math.min(top + alignOffset, dimensions.height - contentHeight - insetBottom)
  );
}

type AlignPositionParams = {
  align: "start" | "center" | "end";
  avoidCollisions: boolean;
  triggerPosition: LayoutPosition;
  contentLayout: LayoutRectangle;
  alignOffset: number;
  insets?: EdgeInsets;
  side: "top" | "bottom" | "left" | "right";
  dimensions: ScaledSize;
};

function adjustHorizontalCollision({
  left,
  contentWidth,
  insetLeft,
  insetRight,
  dimensions,
}: {
  left: number;
  contentWidth: number;
  insetLeft: number;
  insetRight: number;
  dimensions: ScaledSize;
}): number {
  const spaceLeft = left - insetLeft;
  const spaceRight = dimensions.width - insetRight - (left + contentWidth);

  if (spaceLeft > spaceRight && spaceLeft >= contentWidth) {
    return insetLeft;
  }
  if (spaceRight >= contentWidth) {
    return dimensions.width - insetRight - contentWidth;
  }
  return Math.max(
    insetLeft,
    (dimensions.width - contentWidth - insetRight) / 2
  );
}

function getHorizontalAlignWithCollision({
  align,
  triggerPosition,
  contentWidth,
  alignOffset,
  insetLeft,
  insetRight,
  avoidCollisions,
  dimensions,
}: {
  align: "start" | "center" | "end";
  triggerPosition: LayoutPosition;
  contentWidth: number;
  alignOffset: number;
  insetLeft: number;
  insetRight: number;
  avoidCollisions: boolean;
  dimensions: ScaledSize;
}): number {
  let left = getHorizontalAlignPosition({
    align,
    triggerPageX: triggerPosition.pageX,
    triggerWidth: triggerPosition.width,
    contentWidth,
    alignOffset,
    insetLeft,
    insetRight,
    dimensions,
  });

  if (avoidCollisions) {
    const doesCollide =
      left < insetLeft || left + contentWidth > dimensions.width - insetRight;
    if (doesCollide) {
      left = adjustHorizontalCollision({
        left,
        contentWidth,
        insetLeft,
        insetRight,
        dimensions,
      });
    }
  }

  return left;
}

function adjustVerticalCollision({
  idealTop,
  contentHeight,
  insetTop,
  insetBottom,
  dimensions,
}: {
  idealTop: number;
  contentHeight: number;
  insetTop: number;
  insetBottom: number;
  dimensions: ScaledSize;
}): number {
  const spaceTop = idealTop - insetTop;
  const spaceBottom =
    dimensions.height - insetBottom - (idealTop + contentHeight);

  if (spaceTop > spaceBottom && spaceTop >= contentHeight) {
    return insetTop;
  }
  if (spaceBottom >= contentHeight) {
    return dimensions.height - insetBottom - contentHeight;
  }
  return Math.max(
    insetTop,
    (dimensions.height - contentHeight - insetBottom) / 2
  );
}

function getVerticalAlignWithCollision({
  verticalAlign,
  triggerPosition,
  contentHeight,
  alignOffset,
  insetTop,
  insetBottom,
  avoidCollisions,
  dimensions,
}: {
  verticalAlign: "start" | "center" | "end";
  triggerPosition: LayoutPosition;
  contentHeight: number;
  alignOffset: number;
  insetTop: number;
  insetBottom: number;
  avoidCollisions: boolean;
  dimensions: ScaledSize;
}): number {
  let top = getVerticalAlignPosition({
    align: verticalAlign,
    triggerPageY: triggerPosition.pageY,
    triggerHeight: triggerPosition.height,
    contentHeight,
    alignOffset,
    insetTop,
    insetBottom,
    dimensions,
  });

  if (avoidCollisions) {
    const doesCollide =
      top < insetTop || top + contentHeight > dimensions.height - insetBottom;
    if (doesCollide) {
      const triggerCenter = triggerPosition.pageY + triggerPosition.height / 2;
      const idealTop = triggerCenter - contentHeight / 2;

      if (
        idealTop >= insetTop &&
        idealTop + contentHeight <= dimensions.height - insetBottom
      ) {
        top = idealTop;
      } else {
        top = adjustVerticalCollision({
          idealTop,
          contentHeight,
          insetTop,
          insetBottom,
          dimensions,
        });
      }
    }
  }

  return top;
}

function getAlignPosition({
  align = "start",
  avoidCollisions = true,
  triggerPosition,
  contentLayout,
  alignOffset = 0,
  insets,
  side = "bottom",
  dimensions,
}: AlignPositionParams): {
  top?: number;
  left?: number;
  maxWidth?: number;
  maxHeight?: number;
} {
  const insetTop = insets?.top ?? 0;
  const insetBottom = insets?.bottom ?? 0;
  const insetLeft = insets?.left ?? 0;
  const insetRight = insets?.right ?? 0;

  // For top/bottom sides, align horizontally
  if (side === "top" || side === "bottom") {
    const maxContentWidth = dimensions.width - insetLeft - insetRight;
    const contentWidth = Math.min(contentLayout.width, maxContentWidth);

    const left = getHorizontalAlignWithCollision({
      align,
      triggerPosition,
      contentWidth,
      alignOffset,
      insetLeft,
      insetRight,
      avoidCollisions,
      dimensions,
    });

    return { left, maxWidth: maxContentWidth };
  }

  // For left/right sides, align vertically and constrain width
  // Default to "center" alignment for left/right sides for better UX
  const verticalAlign =
    (side === "left" || side === "right") && align === "start"
      ? "center"
      : align;

  const maxContentHeight = dimensions.height - insetTop - insetBottom;
  const maxContentWidth = dimensions.width - insetLeft - insetRight;
  const contentHeight = Math.min(contentLayout.height, maxContentHeight);

  const top = getVerticalAlignWithCollision({
    verticalAlign,
    triggerPosition,
    contentHeight,
    alignOffset,
    insetTop,
    insetBottom,
    avoidCollisions,
    dimensions,
  });

  return { top, maxHeight: maxContentHeight, maxWidth: maxContentWidth };
}

function getEstimatedPosition({
  align,
  triggerPosition,
  side,
  sideOffset,
  alignOffset,
}: {
  align: "start" | "center" | "end";
  triggerPosition: LayoutPosition;
  side: "top" | "bottom" | "left" | "right";
  sideOffset: number;
  alignOffset: number;
}): { top: number; left: number } {
  // Position near trigger but invisible until layout is measured
  // Use a rough estimate for positioning
  const estimatedHeight = 100; // Rough estimate, will be corrected after layout
  const estimatedWidth = 200;

  let top = 0;
  let left = 0;

  if (side === "top" || side === "bottom") {
    top =
      side === "top"
        ? triggerPosition.pageY - sideOffset - estimatedHeight
        : triggerPosition.pageY + triggerPosition.height + sideOffset;

    // Calculate horizontal alignment
    if (align === "start") {
      left = triggerPosition.pageX;
    } else if (align === "center") {
      left =
        triggerPosition.pageX + triggerPosition.width / 2 - estimatedWidth / 2;
    } else {
      left = triggerPosition.pageX + triggerPosition.width - estimatedWidth;
    }
    left += alignOffset;
  } else {
    left =
      side === "left"
        ? triggerPosition.pageX - sideOffset - estimatedWidth
        : triggerPosition.pageX + triggerPosition.width + sideOffset;

    // Calculate vertical alignment
    if (align === "start") {
      top = triggerPosition.pageY;
    } else if (align === "center") {
      top =
        triggerPosition.pageY +
        triggerPosition.height / 2 -
        estimatedHeight / 2;
    } else {
      top = triggerPosition.pageY + triggerPosition.height - estimatedHeight;
    }
    top += alignOffset;
  }

  return { top, left };
}

export function useRelativePosition({
  align = "start",
  avoidCollisions = true,
  triggerPosition,
  contentLayout,
  alignOffset = 0,
  insets,
  side = "bottom",
  sideOffset = 0,
}: UseRelativePositionArgs): PositionStyle {
  return useMemo(() => {
    const dimensions = Dimensions.get("screen");

    if (!triggerPosition) {
      return {
        position: "absolute",
        opacity: 0,
        top: -9999,
        left: -9999,
      };
    }

    if (!contentLayout) {
      return {
        position: "absolute",
        ...getEstimatedPosition({
          align,
          triggerPosition,
          side,
          sideOffset,
          alignOffset,
        }),
      };
    }

    const sidePosition = getSidePosition({
      side,
      triggerPosition,
      contentLayout,
      sideOffset,
      insets,
      avoidCollisions,
      dimensions,
    });

    const alignPosition = getAlignPosition({
      align,
      avoidCollisions,
      triggerPosition,
      contentLayout,
      alignOffset,
      insets,
      side,
      dimensions,
    });

    return {
      position: "absolute" as const,
      ...sidePosition,
      ...alignPosition,
    };
  }, [
    align,
    avoidCollisions,
    side,
    alignOffset,
    insets,
    triggerPosition,
    contentLayout,
    sideOffset,
  ]);
}
