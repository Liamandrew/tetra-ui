import { createContext, useContext } from "react";

type BottomSheetContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(
  null
);

export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheetContext must be used within an BottomSheet");
  }
  return context;
};
