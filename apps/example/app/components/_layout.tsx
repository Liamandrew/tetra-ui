import { FabHost } from "@repo/tetra-ui/components/floating-action-button";
import { Slot } from "expo-router";

export default function ComponentsLayout() {
  return (
    <FabHost>
      <Slot />
    </FabHost>
  );
}
