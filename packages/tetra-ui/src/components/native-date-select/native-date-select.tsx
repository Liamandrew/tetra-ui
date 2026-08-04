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
import { cn } from "@/lib/utils";
import { ActionInput } from "../action-input";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "../bottom-sheet";
import { ChevronDownIcon } from "../icons";
import {
  InputAddon,
  type InputAddonChild,
  type InputAddonChildren,
  InputAddonIcon,
  useInputAddons,
} from "../input";
import { Slot } from "../slot";
import {
  type NativeDateSelectDisplay,
  type NativeDateSelectMode,
  NativeDateSelectPicker,
} from "./native-date-select-picker";

// Constants
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const NATIVE_DATE_SELECT_INPUT_NAME = "NativeDateSelectInput";
const NATIVE_DATE_SELECT_TRIGGER_NAME = "NativeDateSelectTrigger";
const NATIVE_DATE_SELECT_CONTENT_NAME = "NativeDateSelectContent";
const NATIVE_DATE_SELECT_SHEET_FOOTER_NAME = "NativeDateSelectSheetFooter";
const WHEEL_PICKER_HEIGHT = 216;
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
  display: NativeDateSelectDisplay;
  setDisplay: (display: NativeDateSelectDisplay) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
  placeholder: string;
  setPlaceholder: (placeholder: string) => void;
};

type NativeDateSelectProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: Date;
  onValueChange?: (value: Date) => void;
  mode?: NativeDateSelectMode;
  display?: NativeDateSelectDisplay;
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
  display?: NativeDateSelectDisplay;
  placeholder?: string;
  formatValue?: (date: Date) => string;
  children?: React.ReactNode;
};

type NativeDateSelectTriggerProps = PressableProps & {
  asChild?: boolean;
};

type NativeDateSelectContentProps = {
  title?: string;
  testID?: string;
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
const getDisplayName = (type: React.ReactElement["type"]) => {
  if (typeof type === "string" || !("displayName" in type)) {
    return;
  }
  return type.displayName;
};

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

const findNativeDateSelectSheetFooter = (children: React.ReactNode) => {
  for (const child of Children.toArray(children)) {
    if (
      isValidElement(child) &&
      (child.type === NativeDateSelectSheetFooter ||
        getDisplayName(child.type) === NATIVE_DATE_SELECT_SHEET_FOOTER_NAME)
    ) {
      return child;
    }
  }
};

const hasComposedNativeDateSelectApi = (children: React.ReactNode) => {
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    const name = getDisplayName(child.type);
    if (
      name === NATIVE_DATE_SELECT_INPUT_NAME ||
      name === NATIVE_DATE_SELECT_TRIGGER_NAME ||
      name === NATIVE_DATE_SELECT_CONTENT_NAME
    ) {
      return true;
    }
  }

  return false;
};

// Components
/**
 * Native date/time select built on Expo UI DatePicker (iOS) and DateTimePicker (Android).
 * Omit Trigger/Input/Content for the raw inline picker.
 */
export const NativeDateSelect = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  mode = "date",
  display: displayProp = "default",
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
  // Composed Content uses this for compact vs sheet. Input can override.
  // Root `display` is also the initial value / inline picker style — do not
  // re-sync from props or it will overwrite Input's compact override.
  const [display, setDisplay] = useState<NativeDateSelectDisplay>(displayProp);

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  const containsComposedApi = hasComposedNativeDateSelectApi(children);
  const resolvedValue = value ?? (containsComposedApi ? undefined : new Date());

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
      disabled,
      display,
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
      setDisplay,
      setPlaceholder,
      setSelectedValue,
      value,
    }),
    [
      disabled,
      display,
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
      value,
    ]
  );

  return (
    <NativeDateSelectContext.Provider value={ctx}>
      {containsComposedApi ? (
        children
      ) : resolvedValue === undefined ? null : (
        <NativeDateSelectPicker
          className={className}
          disabled={disabled}
          display={displayProp}
          is24Hour={is24Hour}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={mode}
          onValueChange={onValueChange}
          presentation="inline"
          testID={testID}
          value={resolvedValue}
        />
      )}
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

  return <Comp {...props} disabled={disabled} onPress={handlePress} />;
};

NativeDateSelectTrigger.displayName = NATIVE_DATE_SELECT_TRIGGER_NAME;

/**
 * Form-styled native date select chrome.
 * - Default / wheel: display-only ActionInput (open via NativeDateSelectTrigger)
 * - iOS `compact`: non-pressable input chrome; only the native compact DatePicker is interactive
 */
export const NativeDateSelectInput = ({
  display: displayProp,
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
    display: displayFromRoot,
    minimumDate,
    maximumDate,
    is24Hour,
    setPlaceholder,
    setDisplay,
  } = useNativeDateSelect();

  const display = displayProp ?? displayFromRoot;

  const addonElements = useMemo(() => {
    const addons: InputAddonChild[] = [];
    for (const child of Children.toArray(children)) {
      if (isValidElement(child) && child.type === InputAddon) {
        addons.push(child as InputAddonChild);
      }
    }
    return addons;
  }, [children]);

  const { startAddons, endAddons, pressableClassName } = useInputAddons(
    addonElements as InputAddonChildren
  );

  useLayoutEffect(() => {
    setPlaceholder(placeholder);
  }, [placeholder, setPlaceholder]);

  useLayoutEffect(() => {
    if (displayProp !== undefined) {
      setDisplay(displayProp);
    }
  }, [displayProp, setDisplay]);

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

  if (Platform.OS === "ios" && display === "compact") {
    return (
      <View
        className={cn(
          "flex min-h-12 w-full flex-row items-center gap-2 rounded-lg border border-input bg-background py-2 pr-0 pl-3",
          disabled && "opacity-50",
          pressableClassName,
          className
        )}
      >
        {startAddons}

        <View className="min-w-0 grow" />

        <InputAddon align="inline-end" className="shrink-0">
          <NativeDateSelectPicker
            disabled={disabled}
            display="compact"
            is24Hour={is24Hour}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            mode={mode}
            onValueChange={onValueChange}
            testID={testID}
            value={pickerValue}
          />
        </InputAddon>

        {endAddons}
      </View>
    );
  }

  const sheetInputAddons = [
    ...startAddons,
    <InputAddon align="inline-end" key="native-date-select-chevron">
      <Animated.View style={animatedStyle}>
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
      className={cn(pressableClassName, className)}
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

NativeDateSelectInput.displayName = NATIVE_DATE_SELECT_INPUT_NAME;

/**
 * Presentation surface for the native date select.
 * - iOS wheel/default: bottom sheet with wheel DatePicker
 * - iOS compact: registers footer only (picker lives in NativeDateSelectInput)
 * - Android: Material date/time dialog when open
 */
export const NativeDateSelectContent = ({
  title,
  testID,
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
    display,
    minimumDate,
    maximumDate,
    is24Hour,
    placeholder,
  } = useNativeDateSelect();

  const sheetFooter = useMemo(
    () => findNativeDateSelectSheetFooter(children),
    [children]
  );

  const requiresConfirm = Platform.OS === "ios" && Boolean(sheetFooter);
  const committedValue = value;
  const draftValue = selectedValue ?? committedValue ?? new Date();
  const pickerValue = requiresConfirm
    ? draftValue
    : (committedValue ?? draftValue);
  const sheetTitle = title ?? placeholder;

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

  if (Platform.OS === "ios" && display === "compact") {
    return null;
  }

  if (Platform.OS === "ios") {
    return (
      <BottomSheet
        onOpenChange={requiresConfirm ? onCancel : onOpenChange}
        open={open}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>{sheetTitle}</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className={sheetFooter ? undefined : "pb-4"}>
            <NativeDateSelectPicker
              disabled={disabled}
              display="wheel"
              is24Hour={is24Hour}
              matchContents={false}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              mode={mode}
              onValueChange={handlePickerValueChange}
              style={{ height: WHEEL_PICKER_HEIGHT, width: "100%" }}
              testID={testID}
              value={pickerValue}
            />
          </BottomSheetBody>
          {sheetFooter}
        </BottomSheetContent>
      </BottomSheet>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <NativeDateSelectPicker
      disabled={disabled}
      display={display}
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
    />
  );
};

NativeDateSelectContent.displayName = NATIVE_DATE_SELECT_CONTENT_NAME;

export const NativeDateSelectSheetFooter = (
  props: React.ComponentProps<typeof BottomSheetFooter>
) => {
  return <BottomSheetFooter {...props} />;
};

NativeDateSelectSheetFooter.displayName = NATIVE_DATE_SELECT_SHEET_FOOTER_NAME;

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
