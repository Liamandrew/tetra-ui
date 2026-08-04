import type { SnapPoint } from "@expo/ui";
import {
  BottomSheet as BottomSheetPrimitive,
  Group as GroupPrimitive,
  Host as HostPrimitive,
  RNHostView,
} from "@expo/ui/swift-ui";
import {
  type ModifierConfig,
  type PresentationDetent,
  presentationBackground,
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { useWindowDimensions, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { cn } from "@/lib/utils";
import { useBottomSheetContext } from "./bottom-sheet-context";
import type { BottomSheetContentProps, BottomSheetFooterProps } from "./types";

// Constants
const BOTTOM_SHEET_PADDING = 16;

// Components
export const BottomSheetContent = ({
  showDragIndicator = true,
  snapPoints,
  className,
  children,
  style,
  ...props
}: BottomSheetContentProps) => {
  const { open, onOpenChange } = useBottomSheetContext();
  const backgroundColor = useCSSVariable("--color-background") as string;
  const hasSnapPoints = Boolean(snapPoints && snapPoints.length > 0);

  const { width: windowWidth } = useWindowDimensions();

  const contentModifiers: ModifierConfig[] = [
    presentationBackground(backgroundColor),
    presentationDragIndicator(showDragIndicator ? "visible" : "hidden"),
  ];

  if (hasSnapPoints) {
    contentModifiers.push(
      presentationDetents(snapPoints?.map(snapPointToDetent) || [])
    );
  }

  return (
    <HostPrimitive pointerEvents="none" style={{ position: "absolute" }}>
      <BottomSheetPrimitive
        fitToContents={!hasSnapPoints}
        isPresented={open}
        onIsPresentedChange={onOpenChange}
      >
        <GroupPrimitive modifiers={contentModifiers}>
          <RNHostView matchContents={!hasSnapPoints}>
            <View
              className={cn(
                "flex-1 data-[has-snap-points=true]:h-0 data-[has-snap-points=true]:grow",
                className
              )}
              data-has-snap-points={hasSnapPoints}
              style={[{ width: windowWidth }, style]}
              {...props}
            >
              {children}
            </View>
          </RNHostView>
        </GroupPrimitive>
      </BottomSheetPrimitive>
    </HostPrimitive>
  );
};

export const BottomSheetFooter = ({
  className,
  style,
  ...props
}: BottomSheetFooterProps) => {
  const { bottom } = useSafeAreaInsets();
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(
    () => ({
      paddingBottom: interpolate(
        keyboardProgress.value,
        [0, 1],
        [bottom ? 0 : BOTTOM_SHEET_PADDING, BOTTOM_SHEET_PADDING],
        Extrapolation.CLAMP
      ),
    }),
    [bottom]
  );

  return (
    <Animated.View
      className={cn(
        "flex flex-col gap-2 border-border border-t bg-background px-4 pt-4",
        className
      )}
      style={[animatedStyle, style]}
      {...props}
    />
  );
};

BottomSheetFooter.displayName = "BottomSheetFooter";

// Utils
const snapPointToDetent = (snapPoint: SnapPoint): PresentationDetent => {
  if (snapPoint === "half") {
    return "medium";
  }
  if (snapPoint === "full") {
    return "large";
  }
  return snapPoint;
};
