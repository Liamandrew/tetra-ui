import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  getRelativePosition,
  type UseRelativePositionArgs,
} from "@/registry/lib/relative-position";

export function useRelativePosition(args: UseRelativePositionArgs) {
  const { width, height } = useWindowDimensions();
  const {
    align,
    alignOffset,
    avoidCollisions,
    contentLayout,
    insets,
    side,
    sideOffset,
    triggerPosition,
  } = args;
  return useMemo(
    () =>
      getRelativePosition({
        align,
        alignOffset,
        avoidCollisions,
        contentLayout,
        dimensions: { height, width },
        insets,
        side,
        sideOffset,
        triggerPosition,
      }),
    [
      align,
      alignOffset,
      avoidCollisions,
      contentLayout,
      insets,
      side,
      sideOffset,
      triggerPosition,
      width,
      height,
    ]
  );
}
