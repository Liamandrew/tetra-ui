import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@/registry/lib/utils";
import { Button, ButtonIcon } from "@/registry/ui/button";
import { XIcon } from "@/registry/ui/icons";
import { Slot } from "@/registry/ui/slot";
import {
  BottomSheetContext,
  useBottomSheetContext,
} from "./bottom-sheet-context";
import type {
  BottomSheetCloseProps,
  BottomSheetProps,
  BottomSheetTriggerProps,
} from "./bottom-sheet-types";

// Components
export const BottomSheet = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: BottomSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChangeProp?.(nextOpen);
    },
    [isControlled, onOpenChangeProp]
  );

  const ctx = useMemo(
    () => ({
      fitToContents: true,
      onOpenChange,
      open,
    }),
    [open, onOpenChange]
  );

  return (
    <BottomSheetContext.Provider value={ctx}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const BottomSheetTrigger = ({
  asChild,
  ...props
}: BottomSheetTriggerProps) => {
  const { onOpenChange } = useBottomSheetContext();
  const Comp = asChild ? Slot.Pressable : Pressable;
  return <Comp {...props} onPress={() => onOpenChange(true)} />;
};

export const BottomSheetClose = ({
  asChild,
  ...props
}: BottomSheetCloseProps) => {
  const { onOpenChange } = useBottomSheetContext();
  const Comp = asChild ? Slot.Pressable : Pressable;
  return <Comp {...props} onPress={() => onOpenChange(false)} />;
};

export const BottomSheetBody = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  const { fitToContents } = useBottomSheetContext();

  return (
    <View
      className={cn(
        fitToContents ? undefined : "min-h-0 flex-1",
        "px-4",
        className
      )}
      {...props}
    />
  );
};

export const BottomSheetScrollView = ({
  className,
  contentContainerClassName,
  ...props
}: React.ComponentProps<typeof ScrollView>) => {
  const { fitToContents } = useBottomSheetContext();

  return (
    <ScrollView
      automaticallyAdjustContentInsets={false}
      automaticallyAdjustsScrollIndicatorInsets={false}
      className={cn(
        fitToContents ? undefined : "min-h-0 ios:flex-1",
        className
      )}
      contentContainerClassName={cn(
        "grow-0 px-4 pb-4",
        contentContainerClassName
      )}
      contentInsetAdjustmentBehavior="never"
      nestedScrollEnabled
      {...props}
    />
  );
};

BottomSheetScrollView.displayName = "BottomSheetScrollView";

export const BottomSheetHeader = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn(
        "shrink-0 flex-row items-center gap-1 px-4 ios:pt-8 pt-4.5 pb-4",
        className
      )}
      {...props}
    >
      {children}
      <BottomSheetClose asChild>
        <Button className="ml-auto" size="icon" variant="link">
          <ButtonIcon className="text-muted-foreground">
            <XIcon />
          </ButtonIcon>
        </Button>
      </BottomSheetClose>
    </View>
  );
};

BottomSheetHeader.displayName = "BottomSheetHeader";

export const BottomSheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text
    className={cn(
      "font-semibold text-foreground text-xl leading-none",
      className
    )}
    {...props}
  />
);
