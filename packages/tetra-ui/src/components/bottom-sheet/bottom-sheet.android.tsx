import type { SnapPoint } from "@expo/ui";
import {
  Column,
  Host,
  ModalBottomSheet,
  type ModalBottomSheetRef,
  RNHostView,
} from "@expo/ui/jetpack-compose";
import {
  fillMaxHeight,
  imePadding,
  type ModifierConfig,
  padding,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { cn } from "@/lib/utils";
import { useBottomSheetContext } from "./bottom-sheet-context";
import type { BottomSheetContentProps, BottomSheetFooterProps } from "./types";

// Constants
const BOTTOM_SHEET_PADDING = 16;

// Components
const BottomSheetDragHandle = () => {
  return (
    <ModalBottomSheet.DragHandle>
      <RNHostView matchContents>
        <View className="items-center pt-2.5">
          <View className="h-1.5 w-[38px] rounded-full bg-muted-foreground" />
        </View>
      </RNHostView>
    </ModalBottomSheet.DragHandle>
  );
};

export const BottomSheetContent = ({
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

  const { body, footer, header } = useMemo(
    () => splitBottomSheetChildren(children),
    [children]
  );

  const hasSnapPoints = Boolean(snapPoints && snapPoints.length > 0);
  const hasFooter = Boolean(footer);

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
    const modifiers: ModifierConfig[] = [];

    if (shouldFillMaxHeight(snapPoints)) {
      modifiers.push(fillMaxHeight(0.95));
    }

    if (hasFooter) {
      modifiers.push(imePadding());
    }

    return modifiers;
  }, [hasFooter, snapPoints]);

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
          <Column modifiers={hasSnapPoints ? [weight(1)] : undefined}>
            <RNHostView matchContents={!hasSnapPoints}>
              <View {...props}>
                {header}
                {body}
              </View>
            </RNHostView>
          </Column>
          {footer}
        </Column>
      </ModalBottomSheet>
    </Host>
  );
};

export const BottomSheetFooter = ({
  className,
  style,
  children,
  ...props
}: BottomSheetFooterProps) => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <RNHostView
      matchContents
      modifiers={[
        padding(0, 0, 0, Math.max(safeAreaBottom + BOTTOM_SHEET_PADDING)),
      ]}
    >
      <View
        className={cn(
          "flex flex-col gap-2 border-border border-t bg-background px-4 pt-4",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </View>
    </RNHostView>
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

const getChildDisplayName = (child: React.ReactNode) => {
  if (!isValidElement(child)) {
    return;
  }
  return (child.type as { displayName?: string }).displayName;
};

const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
  const flattened: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return;
    }

    if (isValidElement(child) && child.type === Fragment) {
      flattened.push(
        ...flattenChildren(
          (child.props as { children?: React.ReactNode }).children
        )
      );
      return;
    }

    flattened.push(child);
  });

  return flattened;
};

const splitBottomSheetChildren = (children: React.ReactNode) => {
  const body: React.ReactNode[] = [];
  let footer: React.ReactNode = null;
  let header: React.ReactNode = null;

  for (const child of flattenChildren(children)) {
    const displayName = getChildDisplayName(child);

    if (displayName === "BottomSheetFooter") {
      footer = child;
      continue;
    }

    if (displayName === "BottomSheetHeader") {
      header = child;
      continue;
    }

    body.push(child);
  }

  return { body, footer, header };
};
