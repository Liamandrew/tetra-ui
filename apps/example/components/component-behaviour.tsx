import {
  NativeSheet,
  NativeSheetBody,
  NativeSheetContent,
  NativeSheetHeader,
  NativeSheetModal,
  NativeSheetOverlay,
  NativeSheetTitle,
  NativeSheetTrigger,
} from "@repo/tetra-ui/components/native-sheet";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Switch } from "@repo/tetra-ui/components/switch";
import { Text } from "@repo/tetra-ui/components/text";

type ComponentBehaviourSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: string;
};

export const ComponentBehaviourSwitch = ({
  checked,
  onCheckedChange,
  children,
}: ComponentBehaviourSwitchProps) => {
  return (
    <Stack className="justify-between" direction="row" gap="sm">
      <Text>{children}</Text>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </Stack>
  );
};

type ComponentBehaviourSheetProps = React.ComponentProps<typeof NativeSheet> & {
  trigger: React.ReactNode;
};

export const ComponentBehaviourSheet = ({
  trigger,
  children,
  ...props
}: ComponentBehaviourSheetProps) => {
  return (
    <NativeSheet {...props}>
      <NativeSheetTrigger asChild>{trigger}</NativeSheetTrigger>
      <NativeSheetModal>
        <NativeSheetOverlay />
        <NativeSheetContent>
          <NativeSheetHeader>
            <NativeSheetTitle>Behavior</NativeSheetTitle>
          </NativeSheetHeader>
          <NativeSheetBody>
            <Stack gap="md">{children}</Stack>
          </NativeSheetBody>
        </NativeSheetContent>
      </NativeSheetModal>
    </NativeSheet>
  );
};
