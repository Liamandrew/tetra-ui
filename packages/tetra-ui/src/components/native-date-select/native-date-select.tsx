import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableProps,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/registry/lib/utils";
import { ActionInput } from "@/registry/ui/action-input";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/registry/ui/bottom-sheet";
import { ChevronDownIcon } from "@/registry/ui/icons";
import {
  InputAddon,
  type InputAddonChild,
  type InputAddonChildren,
  InputAddonIcon,
  useInputAddons,
} from "@/registry/ui/input";
import { Slot } from "@/registry/ui/slot";
import {
  type NativeDateSelectMode,
  NativeDateSelectPicker,
  type NativeDateSelectVariant,
} from "./native-date-select-picker";
import { nativeDateSelectSlots } from "./native-date-select-slots";

// Constants
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const WHEEL_PICKER_HEIGHT = 216;
const GRAPHICAL_PICKER_HEIGHT = 360;
const DEFAULT_PLACEHOLDER = "Pick a date";

// Types
type NativeDateSelectContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: Date;
  onValueChange: (value: Date) => void;
  selectedValue?: Date;
  setSelectedValue: (value: Date) => void;
  onConfirm: (value?: Date) => void;
  onCancel: () => void;
  disabled?: boolean;
  mode: NativeDateSelectMode;
  variant: NativeDateSelectVariant;
  setVariant: (variant: NativeDateSelectVariant) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
  placeholder: string;
  setPlaceholder: (placeholder: string) => void;
  className?: string;
  testID?: string;
};

type NativeDateSelectProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: Date;
  onValueChange?: (value: Date) => void;
  mode?: NativeDateSelectMode;
  variant?: NativeDateSelectVariant;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  is24Hour?: boolean;
  className?: string;
  testID?: string;
  children?: React.ReactNode;
};

type NativeDateSelectInputProps = Partial<
  React.ComponentProps<typeof ActionInput>
> & {
  variant?: NativeDateSelectVariant;
  placeholder?: string;
  formatValue?: (date: Date) => string;
  children?: React.ReactNode;
};

type NativeDateSelectTriggerProps = PressableProps & {
  asChild?: boolean;
};

type NativeDateSelectContentProps = {
  children?: React.ReactNode;
};

type NativeDateSelectSheetConfirmProps = PressableProps & {
  asChild?: boolean;
};

// Context
const NativeDateSelectContext =
  createContext<NativeDateSelectContextProps | null>(null);

const useNativeDateSelect = () => {
  const context = useContext(NativeDateSelectContext);
  if (!context) {
    throw new Error(
      "useNativeDateSelect must be used within a NativeDateSelect"
    );
  }
  return context;
};

// Helpers
const formatDateByMode = (date: Date, mode: NativeDateSelectMode) => {
  switch (mode) {
    case "time":
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
    case "datetime":
      return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    default:
      return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
  }
};

// Components
/**
 * Native date/time select built on Expo UI DatePicker (iOS) and DateTimePicker (Android).
 * Always compose with NativeDateSelectContent. Optionally add Trigger and Input.
 */
export const NativeDateSelect = (props: NativeDateSelectProps) => {
  return (
    <nativeDateSelectSlots.Provider>
      <NativeDateSelectRoot {...props} />
    </nativeDateSelectSlots.Provider>
  );
};

const NativeDateSelectRoot = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  mode = "date",
  variant: variantProp = "default",
  minimumDate,
  maximumDate,
  disabled,
  is24Hour,
  className,
  testID,
  children,
}: NativeDateSelectProps) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [internalValue, setInternalValue] = useState<Date>();
  const [selectedValue, setSelectedValue] = useState<Date>();
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const hasInput = nativeDateSelectSlots.useHasSlot("input");
  const [variant, setVariant] = useState<NativeDateSelectVariant>(variantProp);

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  useLayoutEffect(() => {
    if (hasInput) {
      return;
    }

    setVariant(variantProp);
  }, [hasInput, variantProp]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChangeProp?.(nextOpen);
    },
    [isOpenControlled, onOpenChangeProp]
  );

  const onValueChange = useCallback(
    (nextValue: Date) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChangeProp?.(nextValue);
    },
    [isValueControlled, onValueChangeProp]
  );

  const onConfirm = useCallback(
    (nextValue?: Date) => {
      const finalValue = nextValue ?? selectedValue;

      if (finalValue !== undefined) {
        onValueChange(finalValue);
      }

      onOpenChange(false);
    },
    [onOpenChange, onValueChange, selectedValue]
  );

  const onCancel = useCallback(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
    onOpenChange(false);
  }, [onOpenChange, value]);

  const ctx = useMemo(
    () => ({
      className,
      disabled,
      is24Hour,
      maximumDate,
      minimumDate,
      mode,
      onCancel,
      onConfirm,
      onOpenChange,
      onValueChange,
      open,
      placeholder,
      selectedValue,
      setPlaceholder,
      setSelectedValue,
      setVariant,
      testID,
      value,
      variant,
    }),
    [
      className,
      disabled,
      is24Hour,
      maximumDate,
      minimumDate,
      mode,
      onCancel,
      onConfirm,
      onOpenChange,
      onValueChange,
      open,
      placeholder,
      selectedValue,
      testID,
      value,
      variant,
    ]
  );

  return (
    <NativeDateSelectContext.Provider value={ctx}>
      {children}
    </NativeDateSelectContext.Provider>
  );
};

export const NativeDateSelectTrigger = ({
  asChild,
  onPress: onPressProp,
  ...props
}: NativeDateSelectTriggerProps) => {
  const { disabled, onOpenChange, value, selectedValue, setSelectedValue } =
    useNativeDateSelect();

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onPressProp?.(event);

      if (disabled) {
        return;
      }

      const seedValue = selectedValue ?? value ?? new Date();
      setSelectedValue(seedValue);
      onOpenChange(true);
    },
    [
      disabled,
      onOpenChange,
      onPressProp,
      selectedValue,
      setSelectedValue,
      value,
    ]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <nativeDateSelectSlots.Fill name="trigger" passthrough>
      <Comp {...props} disabled={disabled} onPress={handlePress} />
    </nativeDateSelectSlots.Fill>
  );
};

NativeDateSelectTrigger.displayName = "NativeDateSelectTrigger";

/**
 * Form-styled native date select input.
 * - Default / wheel / graphical: display-only ActionInput (open via NativeDateSelectTrigger)
 * - iOS `compact`: non-pressable input shell; only the native compact DatePicker is interactive
 */
export const NativeDateSelectInput = (props: NativeDateSelectInputProps) => {
  return (
    <nativeDateSelectSlots.Fill name="input" passthrough>
      <NativeDateSelectInputView {...props} />
    </nativeDateSelectSlots.Fill>
  );
};

NativeDateSelectInput.displayName = "NativeDateSelectInput";

const NativeDateSelectInputView = ({
  variant: variantProp,
  placeholder = DEFAULT_PLACEHOLDER,
  formatValue,
  className,
  testID,
  children,
  ...props
}: NativeDateSelectInputProps) => {
  const {
    open,
    value,
    onValueChange,
    selectedValue,
    disabled,
    mode,
    variant: variantFromRoot,
    minimumDate,
    maximumDate,
    is24Hour,
    setPlaceholder,
    setVariant,
  } = useNativeDateSelect();

  const variant = variantProp ?? variantFromRoot;

  const addonElements = useMemo(() => {
    const addons: InputAddonChild[] = [];
    for (const child of Children.toArray(children)) {
      if (isValidElement(child) && child.type === InputAddon) {
        addons.push(child as InputAddonChild);
      }
    }
    return addons;
  }, [children]);

  const { startAddons, endAddons, groupClassName } = useInputAddons(
    addonElements as InputAddonChildren
  );

  useLayoutEffect(() => {
    setPlaceholder(placeholder);
  }, [placeholder, setPlaceholder]);

  useLayoutEffect(() => {
    if (variantProp !== undefined) {
      setVariant(variantProp);
    }
  }, [variantProp, setVariant]);

  const committedValue = value;
  const pickerValue = selectedValue ?? committedValue ?? new Date();

  const valueLabel = useMemo(() => {
    if (committedValue === undefined) {
      return;
    }
    return formatValue
      ? formatValue(committedValue)
      : formatDateByMode(committedValue, mode);
  }, [committedValue, formatValue, mode]);

  const openSharedValue = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    openSharedValue.value = withTiming(open ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [open, openSharedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(openSharedValue.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  if (Platform.OS === "ios" && variant === "compact") {
    return (
      <View
        className={cn(
          "flex min-h-12 w-full flex-row items-center gap-2 rounded-lg border border-input bg-background py-2 pr-0 pl-3",
          disabled && "opacity-50",
          groupClassName,
          className
        )}
      >
        {startAddons}

        <View className="min-w-0 grow" />

        <InputAddon align="inline-end" className="shrink-0">
          <NativeDateSelectPicker
            disabled={disabled}
            is24Hour={is24Hour}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            mode={mode}
            onValueChange={onValueChange}
            testID={testID}
            value={pickerValue}
            variant="compact"
          />
        </InputAddon>

        {endAddons}
      </View>
    );
  }

  const sheetInputAddons = [
    ...startAddons,
    <InputAddon align="inline-end" key="native-date-select-chevron">
      <Animated.View pointerEvents="box-none" style={animatedStyle}>
        <InputAddonIcon>
          <ChevronDownIcon />
        </InputAddonIcon>
      </Animated.View>
    </InputAddon>,
    ...endAddons,
  ] as InputAddonChildren;

  return (
    <ActionInput
      {...props}
      className={cn(groupClassName, className)}
      disabled={disabled}
      focused={open}
      placeholder={placeholder}
      testID={testID}
      value={valueLabel}
    >
      {sheetInputAddons}
    </ActionInput>
  );
};

/**
 * Presentation surface for the native date select. Always required.
 * - Content-only: inline native picker (variant from root)
 * - iOS wheel/default + form UI: bottom sheet with wheel DatePicker
 * - iOS graphical + form UI: bottom sheet with graphical DatePicker
 * - iOS compact + Input: no sheet (picker lives in NativeDateSelectInput)
 * - Android + form UI: Material date/time dialog when open
 */
export const NativeDateSelectContent = ({
  children,
}: NativeDateSelectContentProps) => {
  const {
    open,
    onOpenChange,
    value,
    onValueChange,
    selectedValue,
    setSelectedValue,
    onCancel,
    disabled,
    mode,
    variant,
    minimumDate,
    maximumDate,
    is24Hour,
    placeholder,
    className,
    testID,
  } = useNativeDateSelect();

  const hasTrigger = nativeDateSelectSlots.useHasSlot("trigger");
  const hasInput = nativeDateSelectSlots.useHasSlot("input");
  const hasFooter = nativeDateSelectSlots.useHasSlot("footer");
  const hasFormUi = hasTrigger || hasInput;

  const requiresConfirm = Platform.OS === "ios" && hasFormUi && hasFooter;
  const committedValue = value;
  const draftValue = selectedValue ?? committedValue ?? new Date();
  const pickerValue = requiresConfirm
    ? draftValue
    : (committedValue ?? draftValue);

  const handlePickerValueChange = useCallback(
    (nextValue: Date) => {
      if (requiresConfirm) {
        setSelectedValue(nextValue);
        return;
      }
      onValueChange(nextValue);
    },
    [onValueChange, requiresConfirm, setSelectedValue]
  );

  if (!hasFormUi) {
    return (
      <>
        {children}
        <NativeDateSelectPicker
          className={className}
          disabled={disabled}
          is24Hour={is24Hour}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={mode}
          onValueChange={onValueChange}
          presentation="inline"
          testID={testID}
          value={committedValue ?? new Date()}
          variant={variant}
        />
      </>
    );
  }

  if (Platform.OS === "ios" && variant === "compact" && hasInput) {
    return children;
  }

  if (Platform.OS === "ios") {
    const sheetVariant = variant === "graphical" ? "graphical" : "wheel";

    return (
      <>
        {children}
        <BottomSheet
          onOpenChange={requiresConfirm ? onCancel : onOpenChange}
          open={open}
        >
          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>{placeholder}</BottomSheetTitle>
            </BottomSheetHeader>
            <BottomSheetBody className={hasFooter ? undefined : "pb-4"}>
              <NativeDateSelectPicker
                disabled={disabled}
                is24Hour={is24Hour}
                matchContents={false}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                mode={mode}
                onValueChange={(nextValue) => {
                  handlePickerValueChange(nextValue);

                  if (sheetVariant === "graphical" && !requiresConfirm) {
                    onOpenChange(false);
                  }
                }}
                style={{
                  height:
                    sheetVariant === "graphical"
                      ? GRAPHICAL_PICKER_HEIGHT
                      : WHEEL_PICKER_HEIGHT,
                  width: "100%",
                }}
                testID={testID}
                value={pickerValue}
                variant={sheetVariant}
              />
            </BottomSheetBody>
            <nativeDateSelectSlots.Outlet name="footer" />
          </BottomSheetContent>
        </BottomSheet>
      </>
    );
  }

  if (!open) {
    return children;
  }

  return (
    <>
      {children}
      <NativeDateSelectPicker
        disabled={disabled}
        is24Hour={is24Hour}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        mode={mode}
        onDismiss={onCancel}
        onValueChange={(nextValue) => {
          onValueChange(nextValue);
          onOpenChange(false);
        }}
        presentation="dialog"
        testID={testID}
        value={pickerValue}
        variant={variant}
      />
    </>
  );
};

NativeDateSelectContent.displayName = "NativeDateSelectContent";

export const NativeDateSelectSheetFooter = (
  props: React.ComponentProps<typeof BottomSheetFooter>
) => {
  return (
    <nativeDateSelectSlots.Fill name="footer">
      <BottomSheetFooter {...props} />
    </nativeDateSelectSlots.Fill>
  );
};

NativeDateSelectSheetFooter.displayName = "NativeDateSelectSheetFooter";

export const NativeDateSelectSheetConfirm = ({
  asChild,
  onPress: onPressProp,
  ...props
}: NativeDateSelectSheetConfirmProps) => {
  const { onConfirm } = useNativeDateSelect();

  const onPress = useCallback(
    (event: GestureResponderEvent) => {
      onPressProp?.(event);
      onConfirm();
    },
    [onConfirm, onPressProp]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={onPress} />;
};
