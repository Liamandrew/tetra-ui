import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { Button, ButtonIcon } from "../button";
import { XIcon } from "../icons";
import { Slot } from "../slot";
import {
  BottomSheetContext,
  useBottomSheetContext,
} from "./bottom-sheet-context";
import type {
  BottomSheetCloseProps,
  BottomSheetProps,
  BottomSheetTriggerProps,
} from "./types";

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
}: React.ComponentProps<typeof View>) => (
  <View className={cn("flex-1 px-4", className)} {...props} />
);

export const BottomSheetScrollView = ({
  className,
  contentContainerClassName,
  ...props
}: React.ComponentProps<typeof ScrollView>) => (
  <ScrollView
    contentContainerClassName={cn("px-4 pb-4", contentContainerClassName)}
    nestedScrollEnabled
    {...props}
  />
);

BottomSheetScrollView.displayName = "BottomSheetScrollView";

export const BottomSheetHeader = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    className={cn(
      "flex flex-row items-center gap-1 px-4 ios:pt-6 pt-4.5 pb-4",
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
