import {
  Host as HostPrimitive,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "@expo/ui";

// Types
type SwitchProps = Omit<SwitchPrimitiveProps, "modifiers">;

// Components

export const Switch = (props: SwitchProps) => {
  return (
    <HostPrimitive matchContents>
      <SwitchPrimitive {...props} />
    </HostPrimitive>
  );
};
