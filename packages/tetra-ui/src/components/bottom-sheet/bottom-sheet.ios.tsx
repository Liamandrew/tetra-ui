import type { SnapPoint } from "@expo/ui";
import {
  BottomSheet as BottomSheetPrimitive,
  Group as GroupPrimitive,
  Host as HostPrimitive,
  RNHostView,
} from "@expo/ui/swift-ui";
import {
  frame,
  ignoreSafeArea,
  type ModifierConfig,
  type PresentationDetent,
  presentationBackground,
  presentationDetents,
  presentationDragIndicator,
  presentationSizing,
} from "@expo/ui/swift-ui/modifiers";
import { cn } from "@repo/tetra-ui/lib/utils";
import { useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import {
  BottomSheetContext,
  useBottomSheetContext,
} from "./bottom-sheet-context";
import type {
  BottomSheetContentProps,
  BottomSheetFooterProps,
} from "./bottom-sheet-types";
import { splitBottomSheetChildren } from "./bottom-sheet-utils";

// Constants
const BOTTOM_SHEET_PADDING = 16;
const ZERO_INSETS = { bottom: 0, left: 0, right: 0, top: 0 };

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
  const { body, footer, header, hasScrollView } = useMemo(
    () => splitBottomSheetChildren(children),
    [children]
  );
  const hasFooter = Boolean(footer);
  // Fitted sheets size to the RN view. A ScrollView reports its full content
  // height, which pushes the header off-screen. Bound scrollable sheets instead.
  const fitToContents = !(hasSnapPoints || hasScrollView);
  const extendScrollToBottomEdge = hasScrollView && !hasFooter;

  const sheetContext = useMemo(
    () => ({
      fitToContents,
      onOpenChange,
      open,
    }),
    [fitToContents, onOpenChange, open]
  );

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { top: topInset } = useSafeAreaInsets();
  const maxFitToContentsHeight = windowHeight - topInset;

  const contentModifiers: ModifierConfig[] = [
    frame({
      alignment: "topLeading",
      maxWidth: Number.POSITIVE_INFINITY,
    }),
    presentationBackground(backgroundColor),
    presentationDragIndicator(showDragIndicator ? "visible" : "hidden"),
  ];

  if (hasSnapPoints) {
    contentModifiers.push(
      presentationDetents(snapPoints?.map(snapPointToDetent) || [])
    );
    if (extendScrollToBottomEdge) {
      contentModifiers.push(
        ignoreSafeArea({ edges: "bottom", regions: "container" })
      );
    }
  } else if (hasScrollView) {
    contentModifiers.push(
      presentationDetents([{ height: maxFitToContentsHeight }])
    );
    if (extendScrollToBottomEdge) {
      contentModifiers.push(
        ignoreSafeArea({ edges: "bottom", regions: "container" })
      );
    }
  } else {
    contentModifiers.push(presentationSizing("fitted"));
  }

  const content = (
    <View
      className={cn("flex-col", className)}
      style={[
        fitToContents
          ? { maxHeight: maxFitToContentsHeight, width: windowWidth }
          : {
              flexGrow: 1,
              height: 0,
            },
        style,
      ]}
      {...props}
    >
      {header}
      {body}
      {footer}
    </View>
  );

  return (
    <BottomSheetContext.Provider value={sheetContext}>
      <HostPrimitive
        pointerEvents="none"
        style={{ position: "absolute", width: windowWidth }}
      >
        <BottomSheetPrimitive
          fitToContents={fitToContents}
          isPresented={open}
          onIsPresentedChange={onOpenChange}
        >
          <GroupPrimitive modifiers={contentModifiers}>
            <RNHostView matchContents={fitToContents}>
              {extendScrollToBottomEdge ? (
                <SafeAreaInsetsContext.Provider value={ZERO_INSETS}>
                  {content}
                </SafeAreaInsetsContext.Provider>
              ) : (
                content
              )}
            </RNHostView>
          </GroupPrimitive>
        </BottomSheetPrimitive>
      </HostPrimitive>
    </BottomSheetContext.Provider>
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
        "shrink-0 flex-col gap-2 border-border border-t bg-background px-4 pt-4",
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
