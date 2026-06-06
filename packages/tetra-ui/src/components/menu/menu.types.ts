import type { IconProps as IconPrimitiveProps } from "@expo/ui";

export type MenuItemVariant = "default" | "destructive";

export type MenuProps = {
  children: React.ReactNode;
};

export type MenuContentProps = {
  children: React.ReactNode;
};

export type MenuTriggerProps = {
  children: React.ReactElement;
};

export type MenuGroupProps = {
  direction?: "horizontal" | "vertical";
  title?: string;
  children: React.ReactNode;
};

export type MenuItemProps = {
  variant?: MenuItemVariant;
  onPress?: () => void;
  children: React.ReactElement | React.ReactElement[];
};

export type MenuItemLabelProps = {
  children: string;
};

export type MenuItemIconProps = {
  icon: IconPrimitiveProps["name"];
};
