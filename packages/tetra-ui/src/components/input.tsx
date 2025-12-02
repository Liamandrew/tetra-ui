import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { cn } from "../lib/utils";
import { Button, ButtonIcon, type ButtonProps, ButtonText } from "./button";

// Constants
const ANIMATION_DURATION = 120;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
type InternalInputAddonButtonContextType = VariantProps<
  typeof inputAddonButtonVariants
> &
  Pick<ButtonProps, "variant">;

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

type InputAddonChild = React.ReactElement<InputAddonProps> | null | false;
export type InputAddonChildren = InputAddonChild | InputAddonChild[];

type InputAddonIconProps = {
  children: React.ReactNode;
  className?: string;
};

type InputAddonButtonProps = Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputAddonButtonVariants>;

type UseInputFocusStateProps = {
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
};

// Context
const InputAddonButtonContext =
  createContext<InternalInputAddonButtonContextType | null>(null);

const useInputAddonButtonContext = () => {
  const context = useContext(InputAddonButtonContext);
  if (!context) {
    throw new Error(
      "useInputAddonButtonContext must be used within a Button component"
    );
  }
  return context;
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
  const inputColor = useCSSVariable("--color-input") as string;
  const ringColor = useCSSVariable("--color-ring") as string;
  const destructiveColor = useCSSVariable("--color-destructive") as string;

  const outlineWidth = useSharedValue(1);
  const outlineColorProgress = useSharedValue(0);

  useEffect(() => {
    if (invalid) {
      outlineWidth.value = withTiming(2, { duration: ANIMATION_DURATION });
      outlineColorProgress.value = withTiming(2, {
        duration: ANIMATION_DURATION,
      });
    } else if (focused) {
      outlineWidth.value = withTiming(2, { duration: ANIMATION_DURATION });
      outlineColorProgress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
      });
    } else {
      outlineWidth.value = withTiming(1, { duration: ANIMATION_DURATION });
      outlineColorProgress.value = withTiming(0, {
        duration: ANIMATION_DURATION,
      });
    }
  }, [focused, invalid, outlineWidth, outlineColorProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const outlineColor = interpolateColor(
      outlineColorProgress.value,
      [0, 1, 2],
      [inputColor, ringColor, destructiveColor]
    );

    return {
      outlineWidth: outlineWidth.value,
      outlineColor,
    };
  });

  return (
    <AnimatedPressable
      accessibilityState={{ disabled }}
      className={cn(
        "flex min-h-12 w-full flex-row items-center gap-2 rounded-lg bg-background px-3 py-2 active:bg-accent/90 disabled:opacity-50 dark:active:bg-accent/50",
        className
      )}
      disabled={disabled}
      onPress={onPress}
      style={animatedStyle}
    >
      {children}
    </AnimatedPressable>
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
    className: cn("size-6 stroke-muted-foreground", props.className),
  });
};

export const InputAddonButton = ({
  className,
  variant = "ghost",
  size = "sm",
  disabled,
  busy,
  ...props
}: InputAddonButtonProps) => {
  const ctx = useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <InputAddonButtonContext.Provider value={ctx}>
      <Button
        {...props}
        busy={busy}
        className={cn(inputAddonButtonVariants({ size }), className)}
        disabled={disabled}
        size={size}
        variant={variant}
      />
    </InputAddonButtonContext.Provider>
  );
};

export const InputAddonButtonText = (
  props: React.ComponentProps<typeof ButtonText>
) => {
  const ctx = useInputAddonButtonContext();
  return (
    <ButtonText
      {...props}
      className={cn(inputAddonButtonTextVariants(ctx), props.className)}
    />
  );
};

export const InputAddonButtonIcon = (
  props: React.ComponentProps<typeof ButtonIcon>
) => {
  const ctx = useInputAddonButtonContext();

  return (
    <ButtonIcon
      {...props}
      className={cn(inputAddonButtonIconVariants(ctx), props.className)}
    />
  );
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

      if (typedChild) {
        if (
          typeof typedChild.props.align === "undefined" ||
          typedChild.props.align === "inline-start"
        ) {
          startAddons.push(typedChild);
        } else {
          endAddons.push(typedChild);
        }
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

const inputAddonButtonVariants = cva("w-fit gap-1 shadow-none", {
  variants: {
    size: { sm: "h-8 px-2", icon: "size-7" },
  },
  defaultVariants: {
    size: "sm",
  },
});

const inputAddonButtonTextVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      outline: "text-muted-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-muted-foreground",
      link: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const inputAddonButtonIconVariants = cva("", {
  variants: {
    variant: {
      default: "stroke-primary-foreground",
      destructive: "stroke-white",
      outline: "stroke-muted-foreground",
      secondary: "stroke-secondary-foreground",
      ghost: "stroke-muted-foreground",
      link: "stroke-muted-foreground",
    },
    size: {
      sm: "size-4",
      icon: "size-5",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});
