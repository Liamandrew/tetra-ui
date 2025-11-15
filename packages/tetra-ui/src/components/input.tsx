import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  type BlurEvent,
  type FocusEvent,
  Pressable,
  TextInput as RNTextInput,
  View,
} from "react-native";
import { useCSSVariable } from "uniwind";
import { cn } from "../lib/utils";

// Types
export type InputProps = Omit<
  React.ComponentPropsWithRef<typeof RNTextInput>,
  "editable"
> & {
  disabled?: boolean;
};

export type InputPressableProps = React.ComponentProps<typeof Pressable> & {
  disabled?: boolean;
  invalid?: boolean;
  focused?: boolean;
};

export type InputAddonProps = React.ComponentProps<typeof View> &
  VariantProps<typeof inputAddonVariants> & {
    children: React.ReactNode;
  };

type InputAddonChild = React.ReactElement<InputAddonProps>;
export type InputAddonChildren = InputAddonChild | InputAddonChild[];

type InputAddonIconProps = {
  children: React.ReactNode;
  className?: string;
};

type UseInputFocusStateProps = {
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
};

// Components
export const Input = ({ className, disabled, ...props }: InputProps) => {
  const placeholderTextColor = useCSSVariable(
    "--color-muted-foreground"
  ) as string;
  return (
    <RNTextInput
      className={cn("grow text-base text-foreground leading-tight", className)}
      editable={!disabled}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
};

export const InputPressable = ({
  children,
  disabled,
  invalid,
  focused,
  onPress,
  className,
}: InputPressableProps) => {
  return (
    <Pressable
      accessibilityState={{ disabled }}
      className={cn(
        "flex min-h-12 w-full grow flex-row items-center gap-2 rounded-lg bg-transparent px-3 py-2 shadow-xs outline outline-input transition-color active:bg-accent/90 disabled:opacity-50 dark:active:bg-accent/50",
        invalid && "outline-2 outline-destructive",
        focused && "outline-2 outline-ring",
        className
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export const InputAddon = ({ align, className, ...props }: InputAddonProps) => {
  return (
    <View className={cn(inputAddonVariants({ align }), className)} {...props} />
  );
};

export const InputAddonIcon = (
  props: InputAddonIconProps
): React.ReactElement | null => {
  const child = Children.only(props.children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "InputAddonIcon expects a single React element as children"
      );
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<InputAddonIconProps>, {
    ...props,
    className: cn("size-6 bg-muted-foreground", props.className),
  });
};

// Hooks
export const useInputFocusState = ({
  onFocus,
  onBlur,
}: UseInputFocusStateProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const internalRef = useRef<RNTextInput>(null);

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      onFocus?.(e);

      setIsFocused(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: BlurEvent) => {
      onBlur?.(e);

      setIsFocused(false);
    },
    [onBlur]
  );

  const handlePress = useCallback(() => internalRef.current?.focus(), []);

  return {
    isFocused,
    internalRef,
    handleFocus,
    handleBlur,
    handlePress,
  };
};

export const useInputAddons = (
  children?: InputAddonChildren | React.ReactElement | null
) => {
  const startAddons: InputAddonChild[] = [];
  const endAddons: InputAddonChild[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === InputAddon) {
      const typedChild = child as InputAddonChild;
      if (
        typeof typedChild.props.align === "undefined" ||
        typedChild.props.align === "inline-start"
      ) {
        startAddons.push(typedChild);
      } else {
        endAddons.push(typedChild);
      }
    }
  });

  return {
    startAddons,
    endAddons,
    pressableClassName: cn(
      startAddons.length && "pl-0",
      endAddons.length && "pr-0"
    ),
  };
};

// Styles
const inputAddonVariants = cva("flex items-center justify-center", {
  variants: {
    align: {
      "inline-start": "pl-3",
      "inline-end": "pr-3",
    },
  },
  defaultVariants: {
    align: "inline-start",
  },
});
