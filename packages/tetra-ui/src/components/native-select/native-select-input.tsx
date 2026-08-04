import type { PickerItemValue } from "@expo/ui";

type NativeSelectAndroidHostProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
};

type NativeSelectTriggerAnchorProps = {
  disabled?: boolean;
  children: React.ReactElement;
};

type NativeSelectContentMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  selectedValue?: PickerItemValue;
  onValueChange: (value: PickerItemValue) => void;
  items: { label: string; value: PickerItemValue }[];
};

/** Default stub — Metro resolves the `.android` file on Android. */
export const NativeSelectAndroidHost = ({
  children,
}: NativeSelectAndroidHostProps) => {
  return <>{children}</>;
};

/** Default stub — Metro resolves the `.android` file on Android. */
export const NativeSelectTriggerAnchor = ({
  children,
}: NativeSelectTriggerAnchorProps) => {
  return <>{children}</>;
};

/** Default stub — Metro resolves the `.android` file on Android. */
export const NativeSelectContentMenu = (
  _props: NativeSelectContentMenuProps
) => {
  return null;
};
