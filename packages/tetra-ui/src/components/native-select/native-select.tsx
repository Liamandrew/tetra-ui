import {
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
  NativeSelectAndroidHost,
  NativeSelectContentMenu,
  NativeSelectTriggerAnchor,
} from "./native-select-input";
import { NativeSelectPicker } from "./native-select-picker";
import { nativeSelectSlots } from "./native-select-slots";

// Constants
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const WHEEL_PICKER_HEIGHT = 216;
const DEFAULT_PLACEHOLDER = "Select...";

type NativeSelectVariant = PickerAppearance;

// Types
type NativeSelectItemData<T extends PickerItemValue> = {
  label: string;
  value: T;
};

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
  items: NativeSelectItemData<T>[];
  itemElements: React.ReactElement[];
  setItemElements: (elements: React.ReactElement[]) => void;
  placeholder: string;
  setPlaceholder: (placeholder: string) => void;
  variant: NativeSelectVariant;
  setVariant: (variant: NativeSelectVariant) => void;
  slotsReady: boolean;
  className?: string;
  testID?: string;
};

type NativeSelectProps<T extends PickerItemValue> = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: T;
  onValueChange?: (value: T) => void;
  disabled?: boolean;
  variant?: NativeSelectVariant;
  className?: string;
  testID?: string;
  children: React.ReactNode;
};

type NativeSelectInputProps = Partial<
  React.ComponentProps<typeof ActionInput>
> & {
  variant?: NativeSelectVariant;
  placeholder?: string;
  children?: React.ReactNode;
};

type NativeSelectTriggerProps = PressableProps & {
  asChild?: boolean;
};

type NativeSelectContentProps = {
  children?: React.ReactNode;
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
const partitionNativeSelectContent = (children: React.ReactNode) => {
  const itemElements: React.ReactElement[] = [];
  const slotChildren: React.ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === NativeSelectItem) {
      itemElements.push(child);
      continue;
    }

    slotChildren.push(child);
  }

  return { itemElements, slotChildren };
};

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

// Components
export const NativeSelectItem = PickerPrimitive.Item;

/**
 * Native single-selection input built on Expo UI Picker.
 * Always compose with NativeSelectContent. Optionally add Trigger and Input.
 */
export const NativeSelect = <T extends PickerItemValue>(
  props: NativeSelectProps<T>
) => {
  return (
    <nativeSelectSlots.Provider>
      <NativeSelectRoot {...props} />
    </nativeSelectSlots.Provider>
  );
};

const NativeSelectRoot = <T extends PickerItemValue>({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  disabled,
  variant: variantProp = "menu",
  className,
  testID,
  children,
}: NativeSelectProps<T>) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [internalValue, setInternalValue] = useState<T>();
  const [selectedValue, setSelectedValue] = useState<T>();
  const [itemElements, setItemElements] = useState<React.ReactElement[]>([]);
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const hasTrigger = nativeSelectSlots.useHasSlot("trigger");
  const hasInput = nativeSelectSlots.useHasSlot("input");
  const hasFormUi = hasTrigger || hasInput;
  const [inputVariant, setVariant] = useState<NativeSelectVariant>();
  const [slotsReady, setSlotsReady] = useState(false);

  const items = useMemo(
    () => extractNativeSelectItems<T>(itemElements),
    [itemElements]
  );

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  // Input/trigger Fills register after this render. Derive variant from slot
  // presence so a later root effect cannot overwrite Input's `wheel` with the
  // root default (`menu`). Trigger-only is always wheel.
  const variant: NativeSelectVariant = hasInput
    ? (inputVariant ?? "wheel")
    : hasTrigger
      ? "wheel"
      : variantProp;

  useLayoutEffect(() => {
    setSlotsReady(true);
  }, []);

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
      className,
      disabled,
      itemElements,
      items,
      onCancel,
      onConfirm,
      onOpenChange,
      onValueChange,
      open,
      placeholder,
      selectedValue,
      setItemElements,
      setPlaceholder,
      setSelectedValue,
      setVariant,
      slotsReady,
      testID,
      value,
      variant,
    }),
    [
      className,
      disabled,
      itemElements,
      items,
      onCancel,
      onConfirm,
      onOpenChange,
      onValueChange,
      open,
      placeholder,
      selectedValue,
      slotsReady,
      testID,
      value,
      variant,
    ]
  );

  return (
    <NativeSelectContext.Provider
      value={ctx as NativeSelectContextProps<T | PickerItemValue>}
    >
      {Platform.OS === "android" && hasFormUi ? (
        <NativeSelectAndroidHost
          disabled={disabled}
          onOpenChange={onOpenChange}
          open={open}
        >
          {children}
        </NativeSelectAndroidHost>
      ) : (
        children
      )}
    </NativeSelectContext.Provider>
  );
};

export const NativeSelectTrigger = ({
  asChild,
  onPress: onPressProp,
  ...props
}: NativeSelectTriggerProps) => {
  const {
    disabled,
    open,
    onOpenChange,
    value,
    items,
    selectedValue,
    setSelectedValue,
  } = useNativeSelect();

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onPressProp?.(event);

      if (disabled) {
        return;
      }

      const committedValue = value ?? items.at(0)?.value;
      const seedValue = selectedValue ?? committedValue;
      if (seedValue !== undefined) {
        setSelectedValue(seedValue);
      }

      if (Platform.OS === "android") {
        onOpenChange(!open);
        return;
      }

      onOpenChange(true);
    },
    [
      disabled,
      items,
      onOpenChange,
      onPressProp,
      open,
      selectedValue,
      setSelectedValue,
      value,
    ]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <nativeSelectSlots.Fill name="trigger" passthrough>
      <NativeSelectTriggerAnchor disabled={disabled}>
        <Comp {...props} disabled={disabled} onPress={handlePress} />
      </NativeSelectTriggerAnchor>
    </nativeSelectSlots.Fill>
  );
};

NativeSelectTrigger.displayName = "NativeSelectTrigger";

/**
 * Form-styled native select input.
 * - Default / wheel: display-only ActionInput (open via NativeSelectTrigger)
 * - iOS `menu`: non-pressable input shell; only the native menu picker is interactive
 */
export const NativeSelectInput = (props: NativeSelectInputProps) => {
  return (
    <nativeSelectSlots.Fill name="input" passthrough>
      <NativeSelectInputView {...props} />
    </nativeSelectSlots.Fill>
  );
};

NativeSelectInput.displayName = "NativeSelectInput";

const NativeSelectInputView = ({
  variant = "wheel",
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  testID,
  children,
  ...props
}: NativeSelectInputProps) => {
  const {
    open,
    value,
    onValueChange,
    items,
    itemElements,
    disabled,
    setPlaceholder,
    setVariant,
  } = useNativeSelect();

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
    setVariant(variant);
  }, [variant, setVariant]);

  const committedValue = value ?? items.at(0)?.value;

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

  if (Platform.OS === "ios" && variant === "menu") {
    if (committedValue === undefined) {
      return null;
    }

    return (
      <View
        className={cn(
          "flex min-h-12 w-full flex-row items-center gap-2 rounded-lg border border-input bg-background py-2 pr-0 pl-3",
          disabled && "opacity-50",
          groupClassName,
          className
        )}
        pointerEvents="box-none"
      >
        {startAddons}

        <View className="min-w-0 grow" />

        <InputAddon align="inline-end">
          <NativeSelectPicker
            appearance="menu"
            enabled={!disabled}
            onValueChange={onValueChange}
            selectedValue={committedValue}
            testID={testID}
          >
            {itemElements}
          </NativeSelectPicker>
        </InputAddon>

        {endAddons}
      </View>
    );
  }

  const sheetInputAddons = [
    ...startAddons,
    <InputAddon align="inline-end" key="native-select-chevron">
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
 * Presentation surface for the native select. Always required.
 * - Content-only: inline Expo Picker (variant from root)
 * - iOS wheel + form UI: bottom sheet with wheel picker
 * - iOS menu + Input: registers items only (picker lives in NativeSelectInput)
 * - Android + form UI: ExposedDropdownMenu items
 */
export const NativeSelectContent = ({ children }: NativeSelectContentProps) => {
  const {
    open,
    onOpenChange,
    value,
    onValueChange,
    selectedValue,
    setSelectedValue,
    onCancel,
    disabled,
    variant,
    placeholder,
    setItemElements,
    slotsReady,
    className,
    testID,
  } = useNativeSelect();

  const hasTrigger = nativeSelectSlots.useHasSlot("trigger");
  const hasInput = nativeSelectSlots.useHasSlot("input");
  const hasFooter = nativeSelectSlots.useHasSlot("footer");
  const hasFormUi = hasTrigger || hasInput;

  const { itemElements, slotChildren } = useMemo(
    () => partitionNativeSelectContent(children),
    [children]
  );
  const items = useMemo(
    () => extractNativeSelectItems(itemElements),
    [itemElements]
  );

  useLayoutEffect(() => {
    setItemElements(itemElements);
  }, [itemElements, setItemElements]);

  const requiresConfirm =
    Platform.OS === "ios" && variant === "wheel" && hasFooter;
  const committedValue = value ?? items.at(0)?.value;
  const draftValue = selectedValue ?? committedValue;
  const pickerValue = requiresConfirm ? draftValue : committedValue;

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

  if (!slotsReady) {
    return slotChildren;
  }

  if (!hasFormUi) {
    if (committedValue === undefined) {
      return slotChildren;
    }

    return (
      <>
        {slotChildren}
        <NativeSelectPicker
          appearance={variant}
          className={className}
          enabled={!disabled}
          onValueChange={onValueChange}
          selectedValue={committedValue}
          testID={testID}
        >
          {itemElements}
        </NativeSelectPicker>
      </>
    );
  }

  // Menu picker is embedded in Input; Content only registers items.
  if (Platform.OS === "ios" && variant === "menu" && hasInput) {
    return slotChildren;
  }

  if (Platform.OS === "android") {
    return (
      <>
        {slotChildren}
        <NativeSelectContentMenu
          disabled={disabled}
          items={items}
          onOpenChange={onOpenChange}
          onValueChange={onValueChange}
          open={open}
          selectedValue={committedValue}
        />
      </>
    );
  }

  if (pickerValue === undefined) {
    return slotChildren;
  }

  return (
    <>
      {slotChildren}
      <BottomSheet
        onOpenChange={requiresConfirm ? onCancel : onOpenChange}
        open={open}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>{placeholder}</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetBody className={hasFooter ? undefined : "pb-4"}>
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
          <nativeSelectSlots.Outlet name="footer" />
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

NativeSelectContent.displayName = "NativeSelectContent";

export const NativeSelectSheetFooter = (
  props: React.ComponentProps<typeof BottomSheetFooter>
) => {
  return (
    <nativeSelectSlots.Fill name="footer">
      <BottomSheetFooter {...props} />
    </nativeSelectSlots.Fill>
  );
};

NativeSelectSheetFooter.displayName = "NativeSelectSheetFooter";

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
