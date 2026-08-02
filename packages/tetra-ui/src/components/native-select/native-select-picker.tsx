import {
  Host as HostPrimitive,
  type PickerAppearance,
  type PickerItemValue,
  Picker as PickerPrimitive,
} from "@expo/ui";
import { withUniwind } from "uniwind";
import { cn } from "@/lib/utils";

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
  return (
    <StyledHost
      className={cn(className)}
      matchContents={matchContents}
      style={style}
    >
      <PickerPrimitive
        appearance={appearance}
        enabled={enabled}
        onValueChange={onValueChange}
        selectedValue={selectedValue}
        testID={testID}
      >
        {children}
      </PickerPrimitive>
    </StyledHost>
  );
};
