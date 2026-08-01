import type { PickerItemValue } from "@expo/ui";
import type { InputAddonChild } from "../input";

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

/** Default stub — Metro resolves the `.android` file on Android. */
export const NativeSelectInputPlatform = (
  _props: NativeSelectInputPlatformProps
) => {
  return null;
};
