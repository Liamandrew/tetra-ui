import { useLayoutEffect } from "react";
import { createSlots } from "@/registry/lib/slots";

export const menuSlots = createSlots<"content" | "trigger">({
  errorMessage: "MenuTrigger and MenuContent must be rendered inside Menu",
});

export const useAssertMenuParts = () => {
  const registry = menuSlots.useRegistry();

  useLayoutEffect(() => {
    if (registry.has("trigger") && registry.has("content")) {
      return;
    }

    throw new Error("Menu must have a MenuTrigger and MenuContent");
  }, [registry]);
};
