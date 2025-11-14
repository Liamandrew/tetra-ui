import { Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { ChevronRight } from "./icons";
import {
  InputAddon,
  type InputAddonChildren,
  InputAddonIcon,
  InputPressable,
  type InputPressableProps,
  useInputAddons,
} from "./input";

// Types
export type ActionInputProps = Omit<InputPressableProps, "focused"> & {
  value?: string;
  placeholder: string;
  children?: InputAddonChildren;
};

// Components
export const ActionInput = ({
  onFocus,
  onBlur,
  value,
  placeholder,
  children,
  className,
  ...props
}: ActionInputProps) => {
  const { startAddons, endAddons, pressableClassName } =
    useInputAddons(children);

  return (
    <InputPressable
      {...props}
      className={cn(pressableClassName, "pr-0", className)}
    >
      {startAddons}

      <View className="grow">
        {value ? (
          <Text className="text-base text-foreground">{value}</Text>
        ) : (
          <Text className="text-base text-muted-foreground">{placeholder}</Text>
        )}
      </View>

      {endAddons.length ? (
        endAddons
      ) : (
        <InputAddon align="inline-end">
          <InputAddonIcon>
            <ChevronRight />
          </InputAddonIcon>
        </InputAddon>
      )}
    </InputPressable>
  );
};
