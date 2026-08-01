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

type ComponentBehaviourSheetProps = React.ComponentProps<typeof BottomSheet> & {
  trigger: React.ReactNode;
};

export const ComponentBehaviourSheet = ({
  trigger,
  children,
  ...props
}: ComponentBehaviourSheetProps) => {
  return (
    <BottomSheet {...props}>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
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
