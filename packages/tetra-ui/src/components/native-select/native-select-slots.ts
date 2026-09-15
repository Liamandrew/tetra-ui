import { createSlots } from "@/registry/lib/slots";

export const nativeSelectSlots = createSlots<"footer" | "input" | "trigger">({
  errorMessage: "NativeSelect parts must be rendered inside NativeSelect",
});
