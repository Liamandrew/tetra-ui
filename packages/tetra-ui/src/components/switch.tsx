import {
  Host as HostPrimitive,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "@expo/ui";
import { tint } from "@expo/ui/swift-ui/modifiers";
import { useCSSVariable } from "uniwind";

// Types
type SwitchProps = Omit<SwitchPrimitiveProps, "modifiers">;

// Components
export const Switch = (props: SwitchProps) => {
  const primaryColor = useCSSVariable("--color-primary") as string;
  return (
    <HostPrimitive matchContents>
      <SwitchPrimitive {...props} modifiers={[tint(primaryColor)]} />
    </HostPrimitive>
  );
};
