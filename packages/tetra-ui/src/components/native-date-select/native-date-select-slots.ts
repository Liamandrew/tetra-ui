import { createSlots } from "@/registry/lib/slots";

export const nativeDateSelectSlots = createSlots<
  "footer" | "input" | "trigger"
>({
  errorMessage:
    "NativeDateSelect parts must be rendered inside NativeDateSelect",
});
