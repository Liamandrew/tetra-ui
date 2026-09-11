import { Text, View } from "react-native";
import { cn } from "@/registry/lib/utils";
import { ChevronRightIcon } from "@/registry/ui/icons";
import {
  InputAddon,
  type InputAddonChildren,
  InputAddonIcon,
  InputGroup,
  type InputGroupProps,
  useInputAddons,
} from "@/registry/ui/input";

// Types
export type ActionInputProps = Omit<InputGroupProps, "children"> & {
  value?: string;
  placeholder: string;
  children?: InputAddonChildren;
};

// Components
export const ActionInput = ({
  value,
  placeholder,
  children,
  className,
  disabled,
  invalid,
  focused,
  ...props
}: ActionInputProps) => {
  const { startAddons, endAddons, groupClassName } = useInputAddons(children);

  return (
    <InputGroup
      accessibilityRole="button"
      {...props}
      className={cn(groupClassName, "pr-0", className)}
      disabled={disabled}
      focused={focused}
      invalid={invalid}
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
            <ChevronRightIcon />
          </InputAddonIcon>
        </InputAddon>
      )}
    </InputGroup>
  );
};
