import { cn } from "@/lib/utils";
import { Search } from "./icons";
import {
  Input,
  InputAddon,
  type InputAddonChildren,
  InputAddonIcon,
  InputPressable,
  type InputProps,
  useInputAddons,
  useInputFocusState,
} from "./input";

// Types
export type SearchInputProps = InputProps & {
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  children?: InputAddonChildren;
};

// Components
export const SearchInput = ({
  onFocus,
  onBlur,
  disabled,
  children,
  accessibilityRole = "search",
  ...props
}: SearchInputProps) => {
  const { isFocused, internalRef, handleFocus, handleBlur, handlePress } =
    useInputFocusState({ onFocus, onBlur });

  const { startAddons, endAddons, pressableClassName } =
    useInputAddons(children);

  return (
    <InputPressable
      className={cn(
        pressableClassName,
        "min-h-11 bg-input/80 py-1 pl-0 active:bg-input dark:active:bg-input"
      )}
      disabled={disabled}
      focused={isFocused}
      onPress={handlePress}
    >
      <InputAddon align="inline-start">
        <InputAddonIcon>
          <Search />
        </InputAddonIcon>
      </InputAddon>

      {startAddons}

      <Input
        {...props}
        accessibilityRole={accessibilityRole}
        className={cn("shrink", props.className)}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={internalRef}
      />

      {endAddons}
    </InputPressable>
  );
};
