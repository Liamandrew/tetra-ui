import type { SnapPoint } from "@expo/ui";
import type { PressableProps, ViewProps } from "react-native";

export type BottomSheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export type BottomSheetContentProps = ViewProps & {
  children: React.ReactNode;
  snapPoints?: SnapPoint[];
  showDragIndicator?: boolean;
  className?: string;
};

export type BottomSheetBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export type BottomSheetTriggerProps = PressableProps & {
  asChild?: boolean;
};

export type BottomSheetCloseProps = PressableProps & {
  asChild?: boolean;
};

export type BottomSheetFooterProps = ViewProps;
