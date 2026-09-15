import { createSlots } from "@/registry/lib/slots";

export const bottomSheetSlots = createSlots<"footer" | "scroll">({
  errorMessage: "BottomSheet parts must be rendered inside BottomSheetContent",
});
