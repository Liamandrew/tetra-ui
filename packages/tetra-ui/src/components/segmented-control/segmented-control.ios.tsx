import { Host as HostPrimitive } from "@expo/ui";
import { Picker, Text } from "@expo/ui/swift-ui";
import {
  disabled as disabledModifier,
  type ModifierConfig,
  pickerStyle,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useMemo, useState } from "react";
import { useCSSVariable, withUniwind } from "uniwind";
import { cn } from "@/registry/lib/utils";
import type {
  SegmentedControlItemLabelProps,
  SegmentedControlItemProps,
  SegmentedControlProps,
} from "./segmented-control-types";
import { extractSegmentedControlItems } from "./segmented-control-utils";

const StyledHost = withUniwind(HostPrimitive);

export const SegmentedControlItemLabel = (
  _: SegmentedControlItemLabelProps
) => {
  return null;
};

SegmentedControlItemLabel.displayName = "SegmentedControlItemLabel";

export const SegmentedControlItem = (_: SegmentedControlItemProps) => {
  return null;
};

SegmentedControlItem.displayName = "SegmentedControlItem";

export const SegmentedControl = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
}: SegmentedControlProps) => {
  const primaryColor = useCSSVariable("--color-primary") as string;
  const items = extractSegmentedControlItems(children);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items.at(0)?.value ?? ""
  );

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const modifiers = useMemo(() => {
    const next: ModifierConfig[] = [
      pickerStyle("segmented"),
      tint(primaryColor),
    ];

    if (disabled) {
      next.push(disabledModifier(true));
    }

    return next;
  }, [disabled, primaryColor]);

  return (
    <StyledHost className={cn("h-7.5 w-full", className)}>
      <Picker
        modifiers={modifiers}
        onSelectionChange={(selection) => {
          handleValueChange(String(selection));
        }}
        selection={value}
      >
        {items.map((item) => (
          <Text key={item.value} modifiers={[tag(item.value)]}>
            {item.label}
          </Text>
        ))}
      </Picker>
    </StyledHost>
  );
};
