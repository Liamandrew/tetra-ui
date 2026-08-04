import { DatePicker, Host as HostPrimitive } from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  disabled as disabledModifier,
  labelsHidden,
  type ModifierConfig,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import type { StyleProp, ViewStyle } from "react-native";
import { useCSSVariable, withUniwind } from "uniwind";
import { cn } from "@/lib/utils";

const StyledHost = withUniwind(HostPrimitive);

export type NativeDateSelectMode = "date" | "time" | "datetime";
export type NativeDateSelectVariant =
  | "default"
  | "wheel"
  | "compact"
  | "graphical";
/** @deprecated Use NativeDateSelectVariant */
export type NativeDateSelectDisplay = NativeDateSelectVariant;
export type NativeDateSelectPresentation = "inline" | "dialog";

export type NativeDateSelectPickerProps = {
  value: Date;
  onValueChange: (value: Date) => void;
  mode?: NativeDateSelectMode;
  variant?: NativeDateSelectVariant;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  is24Hour?: boolean;
  presentation?: NativeDateSelectPresentation;
  onDismiss?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  matchContents?: boolean;
};

const modeToDisplayedComponents = (
  mode: NativeDateSelectMode
): ("date" | "hourAndMinute")[] => {
  switch (mode) {
    case "time":
      return ["hourAndMinute"];
    case "datetime":
      return ["date", "hourAndMinute"];
    default:
      return ["date"];
  }
};

const variantToDatePickerStyle = (
  variant: NativeDateSelectVariant
): "automatic" | "compact" | "graphical" | "wheel" => {
  switch (variant) {
    case "wheel":
      return "wheel";
    case "compact":
      return "compact";
    case "graphical":
      return "graphical";
    default:
      return "automatic";
  }
};

/**
 * iOS native date/time picker via SwiftUI DatePicker.
 * `presentation` is ignored (always inline).
 */
export const NativeDateSelectPicker = ({
  value,
  onValueChange,
  mode = "date",
  variant = "default",
  minimumDate,
  maximumDate,
  disabled,
  className,
  style,
  testID,
  matchContents = true,
}: NativeDateSelectPickerProps) => {
  const primaryColor = useCSSVariable("--color-primary") as string;

  const modifiers: ModifierConfig[] = [
    datePickerStyle(variantToDatePickerStyle(variant)),
    tint(primaryColor),
  ];

  if (variant === "compact") {
    modifiers.push(labelsHidden());
  }

  if (disabled) {
    modifiers.push(disabledModifier(true));
  }

  return (
    <StyledHost
      className={cn(className)}
      matchContents={matchContents}
      style={style}
    >
      <DatePicker
        displayedComponents={modeToDisplayedComponents(mode)}
        modifiers={modifiers}
        onDateChange={onValueChange}
        range={
          minimumDate || maximumDate
            ? { end: maximumDate, start: minimumDate }
            : undefined
        }
        selection={value}
        testID={testID}
      />
    </StyledHost>
  );
};
