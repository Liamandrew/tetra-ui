import { cva } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
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
  FadeIn,
  FadeOut,
  FlipInXDown,
  FlipOutXDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "../lib/utils";
import { Input } from "./input";
import { Text } from "./text";

// Constants
const CARET_ANIMATION_DURATION = 500;
const SLOT_VALUE_ENTER_DURATION = 250;
const SLOT_VALUE_EXIT_DURATION = 100;

export const REGEXP_ONLY_DIGITS = "^\\d+$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

const AnimatedText = Animated.createAnimatedComponent(Text);

// Types
type SlotData = {
  index: number;
  char: string | null;
  placeholderChar: string | null;
  isActive: boolean;
  isCaretVisible: boolean;
};

type OTPInputContextValue = {
  value: string;
  maxLength: number;
  isFocused: boolean;
  disabled?: boolean;
  invalid?: boolean;
  secureTextEntry?: boolean;
  slots: SlotData[];
  inputRef: React.RefObject<RNTextInput | null>;
  focus: () => void;
  onSlotPress: (index: number) => void;
};

type OTPInputSlotContextValue = {
  slot: SlotData;
  isActive: boolean;
  isCaretVisible: boolean;
};

export type OTPInputRef = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setValue: (value: string) => void;
};

export type OTPInputProps = {
  maxLength: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  pattern?: string;
  inputMode?: React.ComponentProps<typeof RNTextInput>["inputMode"];
  placeholder?: string;
  secureTextEntry?: boolean;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
  className?: string;
  children?: React.ReactNode;
};

export type OTPInputGroupProps = React.ComponentProps<typeof View>;

export type OTPInputSlotProps = React.ComponentProps<typeof Pressable> & {
  index: number;
  children?: React.ReactNode;
};

export type OTPInputSeparatorProps = React.ComponentProps<typeof View>;

export type OTPInputSlotPlaceholderProps = React.ComponentProps<typeof Text> & {
  children?: string;
};

export type OTPInputSlotValueProps = React.ComponentProps<typeof Text> & {
  children?: string;
};

export type OTPInputSlotCaretProps = React.ComponentProps<typeof Animated.View>;

// Utils
const defaultPasteTransformer = (maxLength: number) => {
  return (pasted: string): string => {
    const otpRegex = new RegExp(`(?<!\\d)\\d{${maxLength}}(?!\\d)`);
    const match = pasted.match(otpRegex);

    if (match) {
      return match[0];
    }

    return pasted.replace(/\D/g, "").slice(0, maxLength);
  };
};

// Context
const OTPInputContext = createContext<OTPInputContextValue | null>(null);
const OTPInputSlotContext = createContext<OTPInputSlotContextValue | null>(
  null
);

export const useOTPInput = () => {
  const context = useContext(OTPInputContext);

  if (!context) {
    throw new Error("useOTPInput must be used within an OTPInput component");
  }

  return context;
};

export const useOTPInputSlot = () => {
  const context = useContext(OTPInputSlotContext);

  if (!context) {
    throw new Error(
      "useOTPInputSlot must be used within an OTPInputSlot component"
    );
  }

  return context;
};

// Components
export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      maxLength,
      value: valueProp,
      defaultValue,
      onChange,
      onComplete,
      disabled,
      invalid,
      pattern,
      inputMode = "numeric",
      placeholder,
      secureTextEntry,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      className,
      children,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<RNTextInput>(null);

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const setValue = useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onChange?.(nextValue);
      },
      [isControlled, onChange]
    );

    const regexp = useMemo(() => {
      if (!pattern) {
        return null;
      }

      return new RegExp(pattern);
    }, [pattern]);

    const pasteTransformFn = useMemo(
      () => defaultPasteTransformer(maxLength),
      [maxLength]
    );

    const onChangeText = useCallback(
      (text: string) => {
        const isPaste = text.length > value.length + 1;
        const transformedText = isPaste ? pasteTransformFn(text) : text;
        const newValue = transformedText.slice(0, maxLength);

        if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
          return;
        }

        setValue(newValue);

        if (newValue.length === maxLength) {
          onComplete?.(newValue);
        }
      },
      [maxLength, onComplete, pasteTransformFn, regexp, setValue, value.length]
    );

    const onFocus = useCallback(
      (e: FocusEvent) => {
        setIsFocused(true);
        onFocusProp?.(e);
      },
      [onFocusProp]
    );

    const onBlur = useCallback(
      (e: BlurEvent) => {
        setIsFocused(false);
        onBlurProp?.(e);
      },
      [onBlurProp]
    );

    const focus = useCallback(() => {
      inputRef.current?.focus();
    }, []);

    const blur = useCallback(() => {
      inputRef.current?.blur();
    }, []);

    const clear = useCallback(() => {
      inputRef.current?.clear();
      setValue("");
    }, [setValue]);

    useImperativeHandle(
      ref,
      () => ({
        focus,
        blur,
        clear,
        setValue: onChangeText,
      }),
      [blur, clear, focus, onChangeText]
    );

    const slots = useMemo<SlotData[]>(() => {
      return Array.from({ length: maxLength }, (_, slotIdx) => {
        const char = value[slotIdx] ?? null;
        const isActive = isFocused && slotIdx === value.length;
        const placeholderChar =
          isActive || char !== null ? null : (placeholder?.[slotIdx] ?? null);

        return {
          index: slotIdx,
          char,
          placeholderChar,
          isActive,
          isCaretVisible: isActive && char === null,
        };
      });
    }, [isFocused, maxLength, placeholder, value]);

    const onSlotPress = useCallback(
      (_index: number) => {
        focus();
      },
      [focus]
    );

    const contextValue = useMemo<OTPInputContextValue>(
      () => ({
        value,
        maxLength,
        isFocused,
        disabled,
        invalid,
        secureTextEntry,
        slots,
        inputRef,
        focus,
        onSlotPress,
      }),
      [
        disabled,
        focus,
        inputRef,
        invalid,
        isFocused,
        maxLength,
        onSlotPress,
        secureTextEntry,
        slots,
        value,
      ]
    );

    return (
      <OTPInputContext.Provider value={contextValue}>
        <Pressable
          accessibilityRole="none"
          className={cn("relative flex-row items-center gap-2", className)}
          disabled={disabled}
          onPress={focus}
        >
          <Input
            autoComplete={secureTextEntry ? "off" : "one-time-code"}
            caretHidden
            className="absolute h-px w-px opacity-0"
            disabled={disabled}
            inputMode={inputMode}
            onBlur={onBlur}
            onChangeText={onChangeText}
            onFocus={onFocus}
            ref={inputRef}
            secureTextEntry={secureTextEntry}
            textContentType={secureTextEntry ? "password" : "oneTimeCode"}
            value={value}
          />
          {children}
        </Pressable>
      </OTPInputContext.Provider>
    );
  }
);

OTPInput.displayName = "OTPInput";

export const OTPInputGroup = ({ className, ...props }: OTPInputGroupProps) => {
  return (
    <View
      className={cn("flex-row items-center gap-2", className)}
      {...props}
    />
  );
};

export const OTPInputSlot = ({
  index,
  children,
  className,
  disabled: disabledProp,
  ...props
}: OTPInputSlotProps) => {
  const { slots, disabled, invalid, onSlotPress } = useOTPInput();
  const slot = slots[index];

  if (!slot) {
    if (__DEV__) {
      throw new Error(
        `OTPInputSlot index ${index} is out of range. Must be between 0 and ${slots.length - 1}.`
      );
    }

    return null;
  }

  const isDisabled = disabledProp ?? disabled;

  const slotContextValue = useMemo<OTPInputSlotContextValue>(
    () => ({
      slot,
      isActive: slot.isActive,
      isCaretVisible: slot.isCaretVisible,
    }),
    [slot]
  );

  return (
    <OTPInputSlotContext.Provider value={slotContextValue}>
      <Pressable
        accessibilityRole="none"
        className={cn(
          otpInputSlotVariants({
            isActive: slot.isActive,
            invalid,
            disabled: isDisabled,
          }),
          className
        )}
        disabled={isDisabled}
        onPress={() => onSlotPress(index)}
        {...props}
      >
        {children ?? (
          <>
            <OTPInputSlotPlaceholder />
            <OTPInputSlotValue />
            <OTPInputSlotCaret />
          </>
        )}
      </Pressable>
    </OTPInputSlotContext.Provider>
  );
};

export const OTPInputSlotPlaceholder = ({
  children,
  className,
  ...props
}: OTPInputSlotPlaceholderProps) => {
  const { slot, isActive } = useOTPInputSlot();
  const displayChar = children ?? slot.placeholderChar ?? "";

  if (slot.char || isActive || !displayChar) {
    return null;
  }

  return (
    <Text
      className={cn("font-medium text-lg text-muted-foreground/50", className)}
      {...props}
    >
      {displayChar}
    </Text>
  );
};

export const OTPInputSlotValue = ({
  children,
  className,
  ...props
}: OTPInputSlotValueProps) => {
  const { slot } = useOTPInputSlot();
  const { secureTextEntry } = useOTPInput();
  const displayChar =
    children ?? (secureTextEntry && slot.char ? "•" : slot.char) ?? "";

  if (!displayChar) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(SLOT_VALUE_ENTER_DURATION)}
      exiting={FadeOut.duration(SLOT_VALUE_EXIT_DURATION)}
    >
      <AnimatedText
        className={cn("font-medium text-lg", className)}
        entering={FlipInXDown.duration(SLOT_VALUE_ENTER_DURATION)}
        exiting={FlipOutXDown.duration(SLOT_VALUE_ENTER_DURATION)}
        {...props}
      >
        {displayChar}
      </AnimatedText>
    </Animated.View>
  );
};

export const OTPInputSlotCaret = ({
  className,
  ...props
}: OTPInputSlotCaretProps) => {
  const { isCaretVisible } = useOTPInputSlot();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, { duration: CARET_ANIMATION_DURATION }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!isCaretVisible) {
    return null;
  }

  return (
    <Animated.View
      className={cn(
        "absolute h-4 w-0.5 rounded-full bg-muted-foreground",
        className
      )}
      pointerEvents="none"
      style={animatedStyle}
      {...props}
    />
  );
};

export const OTPInputSeparator = ({
  className,
  ...props
}: OTPInputSeparatorProps) => {
  useOTPInput();

  return (
    <View
      className={cn("h-0.5 w-2 rounded-full bg-input", className)}
      {...props}
    />
  );
};

// Styles
const otpInputSlotVariants = cva(
  "relative h-12 w-11 items-center justify-center overflow-hidden rounded-lg border bg-background",
  {
    variants: {
      isActive: {
        true: "border-2 border-ring",
        false: "border-input",
      },
      invalid: {
        true: "border-destructive",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
      invalid: false,
      disabled: false,
    },
  }
);
