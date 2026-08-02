import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
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
const NATIVE_DATE_SELECT_SHEET_FOOTER_NAME = "NativeDateSelectSheetFooter";
const WHEEL_PICKER_HEIGHT = 216;

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
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
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

type NativeDateSelectInputProps = {
  display?: NativeDateSelectDisplay;
  placeholder?: string;
  formatValue?: (date: Date) => string;
  className?: string;
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

const splitNativeDateSelectInputChildren = (children: React.ReactNode) => {
  const addonElements: InputAddonChild[] = [];
  let sheetFooter: React.ReactElement | undefined;

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (child.type === InputAddon) {
      addonElements.push(child as InputAddonChild);
      continue;
    }

    if (
      child.type === NativeDateSelectSheetFooter ||
      (typeof child.type !== "string" &&
        "displayName" in child.type &&
        child.type.displayName === NATIVE_DATE_SELECT_SHEET_FOOTER_NAME)
    ) {
      sheetFooter = child;
    }
  }

  return { addonElements, sheetFooter };
};

const hasNativeDateSelectInput = (children: React.ReactNode) => {
  for (const child of Children.toArray(children)) {
    if (
      isValidElement(child) &&
      typeof child.type !== "string" &&
      "displayName" in child.type &&
      child.type.displayName === NATIVE_DATE_SELECT_INPUT_NAME
    ) {
      return true;
    }
  }

  return false;
};

// Components
/**
 * Native date/time select built on Expo UI DatePicker (iOS) and DateTimePicker (Android).
 * Omit `NativeDateSelectInput` for the raw picker; include it for ActionInput chrome.
 */
export const NativeDateSelect = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  mode = "date",
  display = "default",
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

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  const containsInput = hasNativeDateSelectInput(children);
  const resolvedValue = value ?? (containsInput ? undefined : new Date());

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
      selectedValue,
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
      selectedValue,
      value,
    ]
  );

  return (
    <NativeDateSelectContext.Provider value={ctx}>
      {containsInput ? (
        children
      ) : resolvedValue === undefined ? null : (
        <NativeDateSelectPicker
          className={className}
          disabled={disabled}
          display={display}
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

/**
 * Form-styled native date select.
 * - iOS `wheel` / default: ActionInput that opens a bottom sheet with a wheel DatePicker
 * - iOS `compact`: non-pressable input chrome; only the native compact DatePicker is interactive
 * - Android: ActionInput that mounts a Material date/time dialog
 */
export const NativeDateSelectInput = ({
  display: displayProp,
  placeholder = "Pick a date",
  formatValue,
  className,
  testID,
  children,
}: NativeDateSelectInputProps) => {
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
    display: displayFromRoot,
    minimumDate,
    maximumDate,
    is24Hour,
  } = useNativeDateSelect();

  const display = displayProp ?? displayFromRoot;

  const { addonElements, sheetFooter } = useMemo(
    () => splitNativeDateSelectInputChildren(children),
    [children]
  );
  const { startAddons, endAddons, pressableClassName } = useInputAddons(
    addonElements as InputAddonChildren
  );

  const requiresConfirm = Platform.OS === "ios" && Boolean(sheetFooter);
  const committedValue = value;
  const draftValue = selectedValue ?? committedValue ?? new Date();
  const pickerValue = requiresConfirm
    ? draftValue
    : (committedValue ?? draftValue);

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

  const handleOpen = useCallback(() => {
    setSelectedValue(pickerValue);
    onOpenChange(true);
  }, [onOpenChange, pickerValue, setSelectedValue]);

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

  if (Platform.OS === "ios") {
    return (
      <>
        <ActionInput
          className={cn(pressableClassName, className)}
          disabled={disabled}
          focused={open}
          onPress={handleOpen}
          placeholder={placeholder}
          value={valueLabel}
        >
          {sheetInputAddons}
        </ActionInput>

        <BottomSheet
          onOpenChange={requiresConfirm ? onCancel : onOpenChange}
          open={open}
        >
          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>{placeholder}</BottomSheetTitle>
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
      </>
    );
  }

  return (
    <>
      <ActionInput
        className={cn(pressableClassName, className)}
        disabled={disabled}
        focused={open}
        onPress={handleOpen}
        placeholder={placeholder}
        value={valueLabel}
      >
        {sheetInputAddons}
      </ActionInput>

      {open ? (
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
      ) : null}
    </>
  );
};

NativeDateSelectInput.displayName = NATIVE_DATE_SELECT_INPUT_NAME;

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
