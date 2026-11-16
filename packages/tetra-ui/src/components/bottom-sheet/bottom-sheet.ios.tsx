import type { SnapPoint } from "@expo/ui";
import {
  BottomSheet as BottomSheetPrimitive,
  Host as HostPrimitive,
  RNHostView,
  VStack,
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
import { useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { cn } from "@/registry/lib/utils";
import {
  BottomSheetContext,
  useBottomSheetContext,
} from "./bottom-sheet-context";
import { bottomSheetSlots } from "./bottom-sheet-slots";
import type {
  BottomSheetContentProps,
  BottomSheetFooterProps,
} from "./bottom-sheet-types";

// Constants
const BOTTOM_SHEET_PADDING = 16;
const ZERO_INSETS = { bottom: 0, left: 0, right: 0, top: 0 };

// Components
export const BottomSheetContent = (props: BottomSheetContentProps) => {
  return (
    <bottomSheetSlots.Provider>
      <BottomSheetContentView {...props} />
    </bottomSheetSlots.Provider>
  );
};

const BottomSheetContentView = ({
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
  const hasFooter = bottomSheetSlots.useHasSlot("footer");
  const hasScrollView = bottomSheetSlots.useHasSlot("scroll");
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
    contentModifiers.push(
      presentationSizing("form", {
        fitted: { horizontal: false, vertical: true },
      })
    );
  }

  const content = (
    <View
      className={cn("flex-col", className)}
      style={[
        fitToContents
          ? { maxHeight: maxFitToContentsHeight }
          : {
              flexGrow: 1,
              height: 0,
            },
        style,
      ]}
      {...props}
    >
      {children}
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
          <VStack modifiers={contentModifiers} spacing={0}>
            <RNHostView matchContents={{ vertical: fitToContents }}>
              {extendScrollToBottomEdge ? (
                <SafeAreaInsetsContext.Provider value={ZERO_INSETS}>
                  {content}
                </SafeAreaInsetsContext.Provider>
              ) : (
                content
              )}
            </RNHostView>
            <bottomSheetSlots.Outlet name="footer" />
          </VStack>
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
  return (
    <bottomSheetSlots.Fill name="footer">
      <RNHostView matchContents={{ vertical: true }}>
        <View
          className={cn(
            "border-border bg-background shrink-0 flex-col gap-2 border-t px-4 pt-4",
            className
          )}
          style={[{ paddingBottom: BOTTOM_SHEET_PADDING }, style]}
          {...props}
        />
      </RNHostView>
    </bottomSheetSlots.Fill>
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
