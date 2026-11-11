import {
  Host as HostPrimitive,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "@expo/ui";
import { Switch as ComposeSwitch } from "@expo/ui/jetpack-compose";
import { testID as testIDModifier } from "@expo/ui/jetpack-compose/modifiers";
import { tint } from "@expo/ui/swift-ui/modifiers";
import { Platform } from "react-native";
import { useCSSVariable } from "uniwind";

// Types
type SwitchProps = Omit<SwitchPrimitiveProps, "label" | "modifiers">;

// Components
const AndroidSwitch = ({
  value,
  onValueChange,
  disabled,
  testID,
}: SwitchProps) => {
  const [primaryColor, primaryForegroundColor, inputColor, mutedColor] =
    useCSSVariable([
      "--color-primary",
      "--color-primary-foreground",
      "--color-input",
      "--color-muted-foreground",
    ]) as [string, string, string, string];

  return (
    <ComposeSwitch
      colors={{
        checkedBorderColor: primaryColor,
        checkedThumbColor: primaryForegroundColor,
        checkedTrackColor: primaryColor,
        uncheckedBorderColor: mutedColor,
        uncheckedThumbColor: mutedColor,
        uncheckedTrackColor: inputColor,
      }}
      enabled={!disabled}
      modifiers={testID ? [testIDModifier(testID)] : undefined}
      onCheckedChange={onValueChange}
      value={value}
    />
  );
};

export const Switch = (props: SwitchProps) => {
  const primaryColor = useCSSVariable("--color-primary") as string;
  return (
    <HostPrimitive matchContents>
      {Platform.OS === "android" ? (
        <AndroidSwitch {...props} />
      ) : (
        <SwitchPrimitive {...props} modifiers={[tint(primaryColor)]} />
      )}
    </HostPrimitive>
  );
};
