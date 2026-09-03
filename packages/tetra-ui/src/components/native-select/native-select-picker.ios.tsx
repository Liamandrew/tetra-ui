import {
  Host as HostPrimitive,
  type PickerAppearance,
  type PickerItemValue,
} from "@expo/ui";
import { Picker as SwiftUIPicker, Text } from "@expo/ui/swift-ui";
import {
  disabled as disabledModifier,
  type ModifierConfig,
  pickerStyle,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { Children, isValidElement } from "react";
import { useCSSVariable, withUniwind } from "uniwind";
import { cn } from "@/registry/lib/utils";

const StyledHost = withUniwind(HostPrimitive);

export type NativeSelectPickerProps<T extends PickerItemValue> = {
  appearance?: PickerAppearance;
  selectedValue: T;
  onValueChange: (value: T) => void;
  enabled?: boolean;
  className?: string;
  style?: React.ComponentProps<typeof HostPrimitive>["style"];
  testID?: string;
  matchContents?: boolean;
  children: React.ReactNode;
};

type PickerItemProps<T extends PickerItemValue> = {
  label: string;
  value: T;
};

const extractItems = <T extends PickerItemValue>(children: React.ReactNode) => {
  const items: PickerItemProps<T>[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    const { label, value } = child.props as PickerItemProps<T>;
    if (typeof label !== "string" || value === undefined) {
      continue;
    }

    items.push({ label, value });
  }

  return items;
};

export const NativeSelectPicker = <T extends PickerItemValue>({
  appearance = "menu",
  selectedValue,
  onValueChange,
  enabled = true,
  className,
  style,
  testID,
  matchContents = true,
  children,
}: NativeSelectPickerProps<T>) => {
  const primaryColor = useCSSVariable("--color-primary") as string;
  const items = extractItems<T>(children);

  const modifiers: ModifierConfig[] = [
    pickerStyle(appearance === "wheel" ? "wheel" : "menu"),
    tint(primaryColor),
  ];

  if (!enabled) {
    modifiers.push(disabledModifier(true));
  }

  return (
    <StyledHost
      className={cn(className)}
      matchContents={matchContents}
      style={style}
    >
      <SwiftUIPicker
        modifiers={modifiers}
        onSelectionChange={(value) => onValueChange(value as T)}
        selection={selectedValue}
        testID={testID}
      >
        {items.map((item) => (
          <Text key={String(item.value)} modifiers={[tag(item.value)]}>
            {item.label}
          </Text>
        ))}
      </SwiftUIPicker>
    </StyledHost>
  );
};
