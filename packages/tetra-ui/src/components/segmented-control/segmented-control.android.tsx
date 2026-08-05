import {
  Host as HostPrimitive,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text,
} from "@expo/ui/jetpack-compose";
import { useState } from "react";
import { useCSSVariable, withUniwind } from "uniwind";
import { cn } from "@/lib/utils";
import type {
  SegmentedControlItemLabelProps,
  SegmentedControlItemProps,
  SegmentedControlProps,
} from "./segmented-control.types";
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
  const primaryForegroundColor = useCSSVariable(
    "--color-primary-foreground"
  ) as string;
  const foregroundColor = useCSSVariable("--color-foreground") as string;
  const mutedForegroundColor = useCSSVariable(
    "--color-muted-foreground"
  ) as string;

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

  return (
    <StyledHost className={cn("w-full", className)} matchContents>
      <SingleChoiceSegmentedButtonRow>
        {items.map((item) => (
          <SegmentedButton
            colors={{
              activeContainerColor: primaryColor,
              activeContentColor: primaryForegroundColor,
              disabledActiveContainerColor: mutedForegroundColor,
              disabledActiveContentColor: primaryForegroundColor,
              disabledInactiveContentColor: mutedForegroundColor,
              inactiveContentColor: foregroundColor,
            }}
            enabled={!disabled}
            key={item.value}
            onClick={() => {
              handleValueChange(item.value);
            }}
            selected={item.value === value}
          >
            <SegmentedButton.Label>
              <Text>{item.label}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </StyledHost>
  );
};
