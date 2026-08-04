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
  NativeSelectAndroidHost,
  NativeSelectContentMenu,
  NativeSelectTriggerAnchor,
} from "./native-select-input";
import { NativeSelectPicker } from "./native-select-picker";

// Constants
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const NATIVE_SELECT_INPUT_NAME = "NativeSelectInput";
const NATIVE_SELECT_TRIGGER_NAME = "NativeSelectTrigger";
const NATIVE_SELECT_CONTENT_NAME = "NativeSelectContent";
const NATIVE_SELECT_SHEET_FOOTER_NAME = "NativeSelectSheetFooter";
const WHEEL_PICKER_HEIGHT = 216;
const DEFAULT_PLACEHOLDER = "Select...";

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
  appearance: PickerAppearance;
  setAppearance: (appearance: PickerAppearance) => void;
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

type NativeSelectInputProps = Partial<
  React.ComponentProps<typeof ActionInput>
> & {
  appearance?: PickerAppearance;
  placeholder?: string;
  children?: React.ReactNode;
};

type NativeSelectTriggerProps = PressableProps & {
  asChild?: boolean;
};

type NativeSelectContentProps = {
  title?: string;
  testID?: string;
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
const getDisplayName = (type: React.ReactElement["type"]) => {
  if (typeof type === "string" || !("displayName" in type)) {
    return;
  }
  return type.displayName;
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

const splitNativeSelectContentChildren = (children: React.ReactNode) => {
  const itemElements: React.ReactElement[] = [];
  let sheetFooter: React.ReactElement | undefined;

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (child.type === NativeSelectItem) {
      itemElements.push(child);
      continue;
    }

    if (
      child.type === NativeSelectSheetFooter ||
      getDisplayName(child.type) === NATIVE_SELECT_SHEET_FOOTER_NAME
    ) {
      sheetFooter = child;
    }
  }

  return { itemElements, sheetFooter };
};

const getNativeSelectComposedFlags = (children: React.ReactNode) => {
  let hasContent = false;
  let hasComposedApi = false;

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    const name = getDisplayName(child.type);
    if (
      name === NATIVE_SELECT_INPUT_NAME ||
      name === NATIVE_SELECT_TRIGGER_NAME ||
      name === NATIVE_SELECT_CONTENT_NAME
    ) {
      hasComposedApi = true;
    }
    if (name === NATIVE_SELECT_CONTENT_NAME) {
      hasContent = true;
    }
  }

  return { hasComposedApi, hasContent };
};

// Components
export const NativeSelectItem = PickerPrimitive.Item;

export const NativeSelect = <T extends PickerItemValue>({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  disabled,
  appearance: appearanceProp = "menu",
  className,
  testID,
  children,
}: NativeSelectProps<T>) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [internalValue, setInternalValue] = useState<T>();
  const [selectedValue, setSelectedValue] = useState<T>();
  const [itemElements, setItemElements] = useState<React.ReactElement[]>([]);
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  // Composed Content defaults to wheel sheet; Input can override to `menu`.
  // Root `appearance` is only for the inline picker path and must not sync here.
  const [appearance, setAppearance] = useState<PickerAppearance>("wheel");

  const items = useMemo(
    () => extractNativeSelectItems<T>(itemElements),
    [itemElements]
  );

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  const { hasComposedApi, hasContent } = getNativeSelectComposedFlags(children);
  const pickerItems = hasComposedApi
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
      appearance,
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
      setAppearance,
      setItemElements,
      setPlaceholder,
      setSelectedValue,
      value,
    }),
    [
      appearance,
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
      value,
    ]
  );

  const content = hasComposedApi ? (
    children
  ) : resolvedValue === undefined ? null : (
    <NativeSelectPicker
      appearance={appearanceProp}
      className={className}
      enabled={!disabled}
      onValueChange={onValueChange}
      selectedValue={resolvedValue}
      testID={testID}
    >
      {children}
    </NativeSelectPicker>
  );

  return (
    <NativeSelectContext.Provider
      value={ctx as NativeSelectContextProps<T | PickerItemValue>}
    >
      {Platform.OS === "android" && hasContent ? (
        <NativeSelectAndroidHost
          disabled={disabled}
          onOpenChange={onOpenChange}
          open={open}
        >
          {content}
        </NativeSelectAndroidHost>
      ) : (
        content
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
    <NativeSelectTriggerAnchor disabled={disabled}>
      <Comp {...props} disabled={disabled} onPress={handlePress} />
    </NativeSelectTriggerAnchor>
  );
};

NativeSelectTrigger.displayName = NATIVE_SELECT_TRIGGER_NAME;

/**
 * Form-styled native select chrome.
 * - Default / wheel: display-only ActionInput (open via NativeSelectTrigger)
 * - iOS `menu`: non-pressable input chrome; only the native menu picker is interactive
 */
export const NativeSelectInput = ({
  appearance = "wheel",
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
    setAppearance,
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

  const { startAddons, endAddons, pressableClassName } = useInputAddons(
    addonElements as InputAddonChildren
  );

  useLayoutEffect(() => {
    setPlaceholder(placeholder);
  }, [placeholder, setPlaceholder]);

  useLayoutEffect(() => {
    setAppearance(appearance);
  }, [appearance, setAppearance]);

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

  if (Platform.OS === "ios" && appearance === "menu") {
    if (committedValue === undefined) {
      return null;
    }

    return (
      <View
        className={cn(
          "flex min-h-12 w-full flex-row items-center gap-2 rounded-lg border border-input bg-background py-2 pr-0 pl-3",
          disabled && "opacity-50",
          pressableClassName,
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

NativeSelectInput.displayName = NATIVE_SELECT_INPUT_NAME;

/**
 * Presentation surface for the native select.
 * - iOS wheel: bottom sheet with wheel picker
 * - iOS menu: registers items only (picker lives in NativeSelectInput)
 * - Android: ExposedDropdownMenu items
 */
export const NativeSelectContent = ({
  title,
  testID,
  children,
}: NativeSelectContentProps) => {
  const {
    open,
    onOpenChange,
    value,
    onValueChange,
    selectedValue,
    setSelectedValue,
    onCancel,
    disabled,
    appearance,
    placeholder,
    setItemElements,
  } = useNativeSelect();

  const { itemElements, sheetFooter } = useMemo(
    () => splitNativeSelectContentChildren(children),
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
    Platform.OS === "ios" && appearance === "wheel" && Boolean(sheetFooter);
  const committedValue = value ?? items.at(0)?.value;
  const draftValue = selectedValue ?? committedValue;
  const pickerValue = requiresConfirm ? draftValue : committedValue;
  const sheetTitle = title ?? placeholder;

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

  if (Platform.OS === "ios" && appearance === "menu") {
    return null;
  }

  if (Platform.OS === "android") {
    return (
      <NativeSelectContentMenu
        disabled={disabled}
        items={items}
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
        open={open}
        selectedValue={committedValue}
      />
    );
  }

  if (pickerValue === undefined) {
    return null;
  }

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
  );
};

NativeSelectContent.displayName = NATIVE_SELECT_CONTENT_NAME;

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
