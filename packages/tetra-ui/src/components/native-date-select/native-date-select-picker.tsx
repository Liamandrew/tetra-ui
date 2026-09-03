import {
  DatePickerDialog,
  DateTimePicker,
  Host as HostPrimitive,
  TimePickerDialog,
} from "@expo/ui/jetpack-compose";
import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { useCSSVariable, withUniwind } from "uniwind";
import { cn } from "@/registry/lib/utils";

const StyledHost = withUniwind(HostPrimitive);

export type NativeDateSelectMode = "date" | "time" | "datetime";
export type NativeDateSelectVariant =
  | "default"
  | "wheel"
  | "compact"
  | "graphical";
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
): "date" | "hourAndMinute" => {
  if (mode === "time") {
    return "hourAndMinute";
  }
  return "date";
};

const variantToAndroidPickerVariant = (
  variant: NativeDateSelectVariant
): "picker" | "input" => {
  if (variant === "wheel") {
    return "input";
  }
  return "picker";
};

const mergeDateAndTime = (datePart: Date, timePart: Date) => {
  const next = new Date(datePart);
  next.setHours(
    timePart.getHours(),
    timePart.getMinutes(),
    timePart.getSeconds(),
    timePart.getMilliseconds()
  );
  return next;
};

/**
 * Android native date/time picker.
 * - `presentation="inline"`: Compose DateTimePicker (date or time; datetime falls back to date)
 * - `presentation="dialog"`: Material dialogs; datetime shows date then time sequentially
 */
export const NativeDateSelectPicker = ({
  value,
  onValueChange,
  mode = "date",
  variant = "default",
  minimumDate,
  maximumDate,
  is24Hour,
  presentation = "inline",
  onDismiss,
  className,
  style,
}: NativeDateSelectPickerProps) => {
  const primaryColor = useCSSVariable("--color-primary") as string;
  const [dialogStep, setDialogStep] = useState<"date" | "time">(
    mode === "time" ? "time" : "date"
  );
  const [pendingDate, setPendingDate] = useState(value);

  const selectableDates =
    minimumDate || maximumDate
      ? { end: maximumDate, start: minimumDate }
      : undefined;

  if (presentation === "dialog") {
    const handleDismiss = () => {
      setDialogStep(mode === "time" ? "time" : "date");
      onDismiss?.();
    };

    if (mode === "time" || dialogStep === "time") {
      return (
        <HostPrimitive style={style}>
          <TimePickerDialog
            color={primaryColor}
            initialDate={(mode === "datetime"
              ? pendingDate
              : value
            ).toISOString()}
            is24Hour={is24Hour}
            onDateSelected={(date) => {
              const next =
                mode === "datetime"
                  ? mergeDateAndTime(pendingDate, date)
                  : date;
              setDialogStep(mode === "time" ? "time" : "date");
              onValueChange(next);
            }}
            onDismissRequest={handleDismiss}
          />
        </HostPrimitive>
      );
    }

    return (
      <HostPrimitive style={style}>
        <DatePickerDialog
          color={primaryColor}
          initialDate={value.toISOString()}
          onDateSelected={(date) => {
            if (mode === "datetime") {
              setPendingDate(date);
              setDialogStep("time");
              return;
            }
            onValueChange(date);
          }}
          onDismissRequest={handleDismiss}
          selectableDates={selectableDates}
          variant={variantToAndroidPickerVariant(variant)}
        />
      </HostPrimitive>
    );
  }

  return (
    <StyledHost
      className={cn("w-full", className)}
      matchContents={{ vertical: true }}
      style={[{ width: "100%" }, style]}
    >
      <DateTimePicker
        color={primaryColor}
        displayedComponents={modeToDisplayedComponents(mode)}
        initialDate={value.toISOString()}
        is24Hour={is24Hour}
        onDateSelected={onValueChange}
        selectableDates={selectableDates}
        showVariantToggle={false}
        variant={variantToAndroidPickerVariant(variant)}
      />
    </StyledHost>
  );
};
