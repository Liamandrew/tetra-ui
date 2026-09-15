import type { SnapPoint } from "@expo/ui";
import {
  Box,
  Column,
  Host,
  ModalBottomSheet,
  type ModalBottomSheetRef,
  RNHostView,
} from "@expo/ui/jetpack-compose";
import {
  background,
  clip,
  fillMaxHeight,
  fillMaxWidth,
  height,
  imePadding,
  type ModifierConfig,
  onSizeChanged,
  padding,
  Shapes,
  weight,
  width,
} from "@expo/ui/jetpack-compose/modifiers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
const DRAG_HANDLE_WIDTH = 38;
const DRAG_HANDLE_HEIGHT = 6;

// Components
const BottomSheetDragHandle = () => {
  const handleColor = useCSSVariable("--color-muted-foreground") as string;

  return (
    <ModalBottomSheet.DragHandle>
      <Column
        horizontalAlignment="center"
        modifiers={[fillMaxWidth(), padding(0, 10, 0, 0)]}
      >
        <Box
          modifiers={[
            width(DRAG_HANDLE_WIDTH),
            height(DRAG_HANDLE_HEIGHT),
            clip(Shapes.Circle),
            background(handleColor),
          ]}
        />
      </Column>
    </ModalBottomSheet.DragHandle>
  );
};

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

  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const [visible, setVisible] = useState(open);

  const backgroundColor = useCSSVariable("--color-background") as string;

  const { width: windowWidth } = useWindowDimensions();
  const hasFooter = bottomSheetSlots.useHasSlot("footer");
  const [sheetWidth, setSheetWidth] = useState(0);

  const hasSnapPoints = Boolean(snapPoints && snapPoints.length > 0);
  const fitToContents = !hasSnapPoints;
  const sheetContext = useMemo(
    () => ({
      fitToContents,
      onOpenChange,
      open,
      sheetWidth,
    }),
    [fitToContents, onOpenChange, open, sheetWidth]
  );

  const handleSheetSizeChanged = useCallback(
    ({ width: nextWidth }: { width: number; height: number }) => {
      setSheetWidth((current) => (current === nextWidth ? current : nextWidth));
    },
    []
  );

  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }

    let cancelled = false;
    sheetRef.current?.hide().then(() => {
      if (!cancelled) {
        setVisible(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleDismiss = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const contentModifiers = useMemo(() => {
    const modifiers: ModifierConfig[] = [
      fillMaxWidth(),
      onSizeChanged(handleSheetSizeChanged),
    ];

    if (shouldFillMaxHeight(snapPoints)) {
      modifiers.push(fillMaxHeight(0.95));
    }

    if (hasFooter) {
      modifiers.push(imePadding());
    }

    return modifiers;
  }, [handleSheetSizeChanged, hasFooter, snapPoints]);

  useEffect(() => {
    if (!(open && hasFooter)) {
      return;
    }

    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      sheetRef.current?.expand();
    });

    return () => {
      showSub.remove();
    };
  }, [hasFooter, open]);

  if (!visible) {
    return null;
  }

  return (
    <BottomSheetContext.Provider value={sheetContext}>
      <Host
        pointerEvents="none"
        style={{ position: "absolute", width: windowWidth }}
      >
        <ModalBottomSheet
          containerColor={backgroundColor}
          onDismissRequest={handleDismiss}
          ref={sheetRef}
          showDragHandle={false}
          skipPartiallyExpanded={shouldSkipPartiallyExpanded(snapPoints)}
        >
          {showDragIndicator ? <BottomSheetDragHandle /> : null}

          <Column modifiers={contentModifiers}>
            <Column modifiers={fitToContents ? undefined : [weight(1)]}>
              <RNHostView matchContents={fitToContents}>
                <View
                  className={cn("flex-col", className)}
                  {...props}
                  style={[
                    fitToContents
                      ? sheetWidth > 0
                        ? { width: sheetWidth }
                        : undefined
                      : { flexGrow: 1, height: 0 },
                    style,
                  ]}
                >
                  {children}
                </View>
              </RNHostView>
            </Column>

            <bottomSheetSlots.Outlet name="footer" />
          </Column>
        </ModalBottomSheet>
      </Host>
    </BottomSheetContext.Provider>
  );
};

export const BottomSheetFooter = ({
  className,
  style,
  children,
  ...props
}: BottomSheetFooterProps) => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { sheetWidth = 0 } = useBottomSheetContext();

  return (
    <bottomSheetSlots.Fill name="footer">
      <RNHostView
        matchContents
        modifiers={[padding(0, 0, 0, safeAreaBottom + BOTTOM_SHEET_PADDING)]}
      >
        <View
          className={cn(
            "flex w-full flex-col gap-2 border-border border-t bg-background px-4 pt-4",
            className
          )}
          style={[
            {
              paddingBottom: BOTTOM_SHEET_PADDING,
              ...(sheetWidth > 0 ? { width: sheetWidth } : null),
            },
            style,
          ]}
          {...props}
        >
          {children}
        </View>
      </RNHostView>
    </bottomSheetSlots.Fill>
  );
};

BottomSheetFooter.displayName = "BottomSheetFooter";

// Utils
const shouldSkipPartiallyExpanded = (
  snapPoints: SnapPoint[] | undefined
): boolean => {
  if (!snapPoints || snapPoints.length === 0) {
    return false;
  }

  return !snapPoints.some(
    (snapPoint) =>
      snapPoint === "half" ||
      (typeof snapPoint === "object" &&
        "fraction" in snapPoint &&
        snapPoint.fraction < 1) ||
      (typeof snapPoint === "object" && "height" in snapPoint)
  );
};

const shouldFillMaxHeight = (snapPoints: SnapPoint[] | undefined): boolean => {
  if (!snapPoints || snapPoints.length === 0) {
    return false;
  }

  return snapPoints.some(
    (snapPoint) =>
      snapPoint === "full" ||
      (typeof snapPoint === "object" &&
        "fraction" in snapPoint &&
        snapPoint.fraction >= 1)
  );
};
