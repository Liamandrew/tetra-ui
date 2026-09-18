import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@repo/tetra-ui/components/bottom-sheet";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Switch } from "@repo/tetra-ui/components/switch";
import { Text } from "@repo/tetra-ui/components/text";
import { useState } from "react";
import { ScreenActionsButton } from "@/components/screen";

type ComponentBehaviourSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  children: string;
};

export const ComponentBehaviourSwitch = ({
  value,
  onValueChange,
  children,
}: ComponentBehaviourSwitchProps) => {
  return (
    <Stack className="justify-between" direction="row" gap="sm">
      <Text>{children}</Text>
      <Switch onValueChange={onValueChange} value={value} />
    </Stack>
  );
};

type ComponentBehaviourSheetProps = React.ComponentProps<typeof BottomSheet>;

export const ComponentBehaviourSheet = ({
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: ComponentBehaviourSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const onOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChangeProp?.(nextOpen);
  };

  return (
    <BottomSheet {...props} onOpenChange={onOpenChange} open={open}>
      <BottomSheetTrigger asChild>
        <ScreenActionsButton open={open} />
      </BottomSheetTrigger>
      <BottomSheetContent snapPoints={[{ fraction: 0.5 }, "full"]}>
        <BottomSheetHeader>
          <BottomSheetTitle>Behavior</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetBody>
          <Stack gap="md">{children}</Stack>
        </BottomSheetBody>
      </BottomSheetContent>
    </BottomSheet>
  );
};
