import type { PickerItemValue } from "@expo/ui";
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Host,
  RNHostView,
  Text as TextPrimitive,
} from "@expo/ui/jetpack-compose";
import { menuAnchor } from "@expo/ui/jetpack-compose/modifiers";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

// Must match InputPressable's focused/invalid outlineWidth. Outline paints
// outside layout; RNHostView/AndroidView clips to the hosted child's bounds.
const INPUT_OUTLINE_MAX_WIDTH = 2;

type NativeSelectAndroidHostProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
};

/**
 * Wraps Trigger + Content so ExposedDropdownMenuBox can own both the anchor and menu.
 *
 * @see https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox/
 */
export const NativeSelectAndroidHost = ({
  open,
  onOpenChange,
  disabled,
  children,
}: NativeSelectAndroidHostProps) => {
  return (
    <Host
      matchContents
      style={{
        alignSelf: "stretch",
        margin: -INPUT_OUTLINE_MAX_WIDTH,
        width: "100%",
      }}
    >
      <ExposedDropdownMenuBox
        expanded={open}
        onExpandedChange={disabled ? undefined : onOpenChange}
      >
        {children}
      </ExposedDropdownMenuBox>
    </Host>
  );
};

type NativeSelectTriggerAnchorProps = {
  disabled?: boolean;
  children: React.ReactElement;
};

/** Anchors the Android ExposedDropdownMenu to the Trigger child. */
export const NativeSelectTriggerAnchor = ({
  disabled,
  children,
}: NativeSelectTriggerAnchorProps) => {
  return (
    <RNHostView
      matchContents
      modifiers={[menuAnchor("primaryNotEditable", !disabled)]}
    >
      <View
        style={{
          alignSelf: "stretch",
          padding: INPUT_OUTLINE_MAX_WIDTH,
          width: "100%",
        }}
      >
        {children}
      </View>
    </RNHostView>
  );
};

type NativeSelectContentMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  selectedValue?: PickerItemValue;
  onValueChange: (value: PickerItemValue) => void;
  items: { label: string; value: PickerItemValue }[];
};

/** Renders the Android ExposedDropdownMenu item list. */
export const NativeSelectContentMenu = ({
  open,
  onOpenChange,
  disabled,
  selectedValue,
  onValueChange,
  items,
}: NativeSelectContentMenuProps) => {
  const foregroundColor = useCSSVariable("--color-foreground") as string;
  const popoverColor = useCSSVariable("--color-popover") as string;

  return (
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
  );
};
