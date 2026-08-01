import {
  Host as HostPrimitive,
  type PickerAppearance,
  type PickerItemValue,
  Picker as PickerPrimitive,
} from "@expo/ui";
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
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { withUniwind } from "uniwind";
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
import { NativeSelectInputPlatform } from "./native-select-input";

// Constants
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const NATIVE_SELECT_INPUT_NAME = "NativeSelectInput";
const NATIVE_SELECT_SHEET_FOOTER_NAME = "NativeSelectSheetFooter";
const WHEEL_PICKER_HEIGHT = 216;

const StyledHost = withUniwind(HostPrimitive);

// Types
type NativeSelectContextProps<T extends PickerItemValue> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: T;
  onValueChange: (value: T) => void;
  selectedValue?: T;
  setSelectedValue: (value: T) => void;
  onConfirm: (value?: T) => void;
  onCancel: () => void;
  disabled?: boolean;
};

type NativeSelectProps<T extends PickerItemValue> = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: T;
  onValueChange?: (value: T) => void;
  disabled?: boolean;
  appearance?: PickerAppearance;
  className?: string;
  testID?: string;
  children: React.ReactNode;
};

type NativeSelectInputProps = {
  placeholder?: string;
  className?: string;
  testID?: string;
  children?: React.ReactNode;
};

type NativeSelectPickerProps<T extends PickerItemValue> = {
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

type NativeSelectItemData<T extends PickerItemValue> = {
  label: string;
  value: T;
};

type NativeSelectSheetConfirmProps = PressableProps & {
  asChild?: boolean;
};

// Context
const NativeSelectContext =
  createContext<NativeSelectContextProps<PickerItemValue> | null>(null);

const useNativeSelect = () => {
  const context = useContext(NativeSelectContext);
  if (!context) {
    throw new Error("useNativeSelect must be used within a NativeSelect");
  }
  return context;
};

// Helpers
const extractNativeSelectItems = <T extends PickerItemValue>(
  children: React.ReactNode
): NativeSelectItemData<T>[] => {
  const items: NativeSelectItemData<T>[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child) || child.type !== NativeSelectItem) {
      continue;
    }

    const { label, value } = child.props as NativeSelectItemData<T>;
    items.push({ label, value });
  }

  return items;
};

const splitNativeSelectInputChildren = (children: React.ReactNode) => {
  const itemElements: React.ReactElement[] = [];
  const addonElements: InputAddonChild[] = [];
  let sheetFooter: React.ReactElement | undefined;

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (child.type === NativeSelectItem) {
      itemElements.push(child);
      continue;
    }

    if (child.type === InputAddon) {
      addonElements.push(child as InputAddonChild);
      continue;
    }

    if (
      child.type === NativeSelectSheetFooter ||
      (typeof child.type !== "string" &&
        "displayName" in child.type &&
        child.type.displayName === NATIVE_SELECT_SHEET_FOOTER_NAME)
    ) {
      sheetFooter = child;
    }
  }

  return { addonElements, itemElements, sheetFooter };
};

const hasNativeSelectInput = (children: React.ReactNode) => {
  for (const child of Children.toArray(children)) {
    if (
      isValidElement(child) &&
      typeof child.type !== "string" &&
      "displayName" in child.type &&
      child.type.displayName === NATIVE_SELECT_INPUT_NAME
    ) {
      return true;
    }
  }

  return false;
};

// Components
export const NativeSelectItem = PickerPrimitive.Item;

const NativeSelectPicker = <T extends PickerItemValue>({
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

export const NativeSelect = <T extends PickerItemValue>({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  disabled,
  appearance = "menu",
  className,
  testID,
  children,
}: NativeSelectProps<T>) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [internalValue, setInternalValue] = useState<T>();
  const [selectedValue, setSelectedValue] = useState<T>();

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  const containsInput = hasNativeSelectInput(children);
  const pickerItems = containsInput
    ? []
    : extractNativeSelectItems<T>(children);
  const resolvedValue = (value ?? pickerItems.at(0)?.value) as T | undefined;

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
    (nextValue: T) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChangeProp?.(nextValue);
    },
    [isValueControlled, onValueChangeProp]
  );

  const onConfirm = useCallback(
    (nextValue?: T) => {
      const finalValue = nextValue ?? selectedValue;

      if (typeof finalValue !== "undefined") {
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
    <NativeSelectContext.Provider
      value={ctx as NativeSelectContextProps<T | PickerItemValue>}
    >
      {containsInput ? (
        children
      ) : resolvedValue === undefined ? null : (
        <NativeSelectPicker
          appearance={appearance}
          className={className}
          enabled={!disabled}
          onValueChange={onValueChange}
          selectedValue={resolvedValue}
          testID={testID}
        >
          {children}
        </NativeSelectPicker>
      )}
    </NativeSelectContext.Provider>
  );
};

/**
 * Form-styled native select.
 * - iOS: ActionInput that opens a bottom sheet with a wheel picker
 * - Android / others: platform dropdown inside input chrome (no sheet)
 */
export const NativeSelectInput = ({
  placeholder = "Select...",
  className,
  testID,
  children,
}: NativeSelectInputProps) => {
  const {
    open,
    onOpenChange,
    value,
    onValueChange,
    selectedValue,
    setSelectedValue,
    onCancel,
    disabled,
  } = useNativeSelect();

  const { itemElements, addonElements, sheetFooter } = useMemo(
    () => splitNativeSelectInputChildren(children),
    [children]
  );
  const items = useMemo(
    () => extractNativeSelectItems(itemElements),
    [itemElements]
  );
  const { startAddons, endAddons, pressableClassName } = useInputAddons(
    addonElements as InputAddonChildren
  );

  const requiresConfirm = Boolean(sheetFooter);
  const committedValue = value ?? items.at(0)?.value;
  const draftValue = selectedValue ?? committedValue;
  const pickerValue = requiresConfirm ? draftValue : committedValue;

  const valueLabel = useMemo(() => {
    if (committedValue === undefined) {
      return;
    }
    return items.find((item) => item.value === committedValue)?.label;
  }, [items, committedValue]);

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
    (nextValue: PickerItemValue) => {
      if (requiresConfirm) {
        setSelectedValue(nextValue);
        return;
      }
      onValueChange(nextValue);
    },
    [onValueChange, requiresConfirm, setSelectedValue]
  );

  if (pickerValue === undefined) {
    return null;
  }

  if (Platform.OS === "ios") {
    const sheetInputAddons = [
      ...startAddons,
      <InputAddon align="inline-end" key="native-select-chevron">
        <Animated.View style={animatedStyle}>
          <InputAddonIcon>
            <ChevronDownIcon />
          </InputAddonIcon>
        </Animated.View>
      </InputAddon>,
      ...endAddons,
    ] as InputAddonChildren;

    return (
      <>
        <ActionInput
          className={cn(pressableClassName, className)}
          disabled={disabled}
          focused={open}
          onPress={() => {
            if (pickerValue !== undefined) {
              setSelectedValue(pickerValue);
            }
            onOpenChange(true);
          }}
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
              <NativeSelectPicker
                appearance="wheel"
                enabled={!disabled}
                matchContents={false}
                onValueChange={handlePickerValueChange}
                selectedValue={pickerValue}
                style={{ height: WHEEL_PICKER_HEIGHT, width: "100%" }}
                testID={testID}
              >
                {itemElements}
              </NativeSelectPicker>
            </BottomSheetBody>
            {sheetFooter}
          </BottomSheetContent>
        </BottomSheet>
      </>
    );
  }

  return (
    <NativeSelectInputPlatform
      className={className}
      disabled={disabled}
      endAddons={endAddons}
      items={items}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
      open={open}
      placeholder={placeholder}
      pressableClassName={pressableClassName}
      selectedValue={pickerValue}
      startAddons={startAddons}
      testID={testID}
      valueLabel={valueLabel}
    />
  );
};

NativeSelectInput.displayName = NATIVE_SELECT_INPUT_NAME;

export const NativeSelectSheetFooter = (
  props: React.ComponentProps<typeof BottomSheetFooter>
) => {
  return <BottomSheetFooter {...props} />;
};

NativeSelectSheetFooter.displayName = NATIVE_SELECT_SHEET_FOOTER_NAME;

export const NativeSelectSheetConfirm = ({
  asChild,
  onPress: onPressProp,
  ...props
}: NativeSelectSheetConfirmProps) => {
  const { onConfirm } = useNativeSelect();

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
