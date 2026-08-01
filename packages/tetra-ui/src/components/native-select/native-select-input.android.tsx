import type { PickerItemValue } from "@expo/ui";
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Host,
  RNHostView,
  Text as TextPrimitive,
} from "@expo/ui/jetpack-compose";
import { clip, menuAnchor, Shapes } from "@expo/ui/jetpack-compose/modifiers";
import { useEffect } from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { cn } from "@/lib/utils";
import { ActionInput } from "../action-input";
import { ChevronDownIcon } from "../icons";
import {
  InputAddon,
  type InputAddonChild,
  type InputAddonChildren,
  InputAddonIcon,
} from "../input";

const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);

type NativeSelectInputPlatformProps = {
  placeholder: string;
  className?: string;
  testID?: string;
  disabled?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valueLabel?: string;
  selectedValue: PickerItemValue;
  onValueChange: (value: PickerItemValue) => void;
  items: { label: string; value: PickerItemValue }[];
  startAddons: InputAddonChild[];
  endAddons: InputAddonChild[];
  pressableClassName?: string;
};

/**
 * Platform NativeSelectInput chrome — ActionInput as ExposedDropdownMenuBox anchor.
 *
 * @see https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox/
 */
export const NativeSelectInputPlatform = ({
  placeholder,
  className,
  testID,
  disabled,
  open,
  onOpenChange,
  valueLabel,
  selectedValue,
  onValueChange,
  items,
  startAddons,
  endAddons,
  pressableClassName,
}: NativeSelectInputPlatformProps) => {
  const foregroundColor = useCSSVariable("--color-foreground") as string;
  const popoverColor = useCSSVariable("--color-popover") as string;

  const openSharedValue = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    openSharedValue.value = withTiming(open ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [open, openSharedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(openSharedValue.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const sheetInputAddons = [
    ...startAddons,
    <InputAddon align="inline-end" key="native-select-chevron">
      <Animated.View style={animatedStyle}>
        <InputAddonIcon>
          <ChevronDownIcon />
        </InputAddonIcon>
      </Animated.View>
    </InputAddon>,
    ...endAddons,
  ] as InputAddonChildren;

  return (
    <Host matchContents style={{ alignSelf: "stretch", width: "100%" }}>
      <ExposedDropdownMenuBox
        expanded={open}
        onExpandedChange={disabled ? undefined : onOpenChange}
      >
        <RNHostView
          matchContents
          modifiers={[
            menuAnchor("primaryNotEditable", !disabled),
            clip(Shapes.RoundedCorner(8)),
          ]}
          style={{ alignSelf: "stretch", width: "100%" }}
        >
          <ActionInput
            className={cn(pressableClassName, className)}
            disabled={disabled}
            focused={open}
            onPress={disabled ? undefined : () => onOpenChange(!open)}
            placeholder={placeholder}
            testID={testID}
            value={valueLabel}
          >
            {sheetInputAddons}
          </ActionInput>
        </RNHostView>

        <ExposedDropdownMenu
          containerColor={popoverColor}
          expanded={open}
          onDismissRequest={() => onOpenChange(false)}
        >
          {items.map((item) => {
            const isSelected = item.value === selectedValue;

            return (
              <DropdownMenuItem
                enabled={!disabled}
                key={String(item.value)}
                onClick={
                  disabled
                    ? undefined
                    : () => {
                        onValueChange(item.value);
                        onOpenChange(false);
                      }
                }
              >
                <DropdownMenuItem.Text>
                  <TextPrimitive color={foregroundColor}>
                    {item.label}
                  </TextPrimitive>
                </DropdownMenuItem.Text>
                {isSelected ? (
                  <DropdownMenuItem.TrailingIcon>
                    <TextPrimitive color={foregroundColor}>✓</TextPrimitive>
                  </DropdownMenuItem.TrailingIcon>
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </ExposedDropdownMenu>
      </ExposedDropdownMenuBox>
    </Host>
  );
};
