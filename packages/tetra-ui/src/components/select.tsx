import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type GestureResponderEvent,
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
import { cn, mergeRefs } from "@/lib/utils";
import { ActionInput } from "./action-input";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetOverlay,
  BottomSheetPortal,
  BottomSheetTitle,
} from "./bottom-sheet";
import { CheckIcon, ChevronDownIcon } from "./icons";
import { InputAddon, type InputAddonChild, InputAddonIcon } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverOverlay,
  PopoverPortal,
  usePopover,
} from "./popover";
import { Slot } from "./slot";
import { Text } from "./text";

// Constants
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.out(Easing.cubic);
const AnimatedChevronDown = Animated.createAnimatedComponent(ChevronDownIcon);

// Types
type LayoutPosition = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

type SelectValueType = number | string;

type SelectOption<T> = {
  value: T;
  label: string;
};

type SelectContextProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: SelectOption<T>[];
  value?: T;
  onValueChange: (value: T) => void;
  selectedValue?: T;
  setSelectedValue: (value: T) => void;
  onConfirm: (value?: T) => void;
  onCancel: () => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder: string;
  popoverTriggerPosition?: LayoutPosition;
  setPopoverTriggerPosition: (position?: LayoutPosition) => void;
};

type SelectItemContextProps<T> = {
  value: T;
};

type SelectProps<T extends SelectValueType> = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  options: SelectOption<T>[];
  value?: T;
  onValueChange?: (value: T) => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  children: React.ReactNode;
};

type SelectTriggerProps = React.ComponentPropsWithRef<typeof Pressable> & {
  asChild?: boolean;
};

type SelectItemProps<T> = SelectOption<T> & Omit<PressableProps, "onPress">;

type SelectContentProps<T> = {
  children:
    | React.ReactElement<SelectItemProps<T>>
    | React.ReactElement<SelectItemProps<T>>[];
};

type SelectContentPopoverProps<T> = React.ComponentProps<
  typeof PopoverContent
> &
  SelectContentProps<T>;

type SelectContentSheetConfirmProps = PressableProps & {
  asChild?: boolean;
};

// Context
const SelectContext = createContext<SelectContextProps<SelectValueType> | null>(
  null
);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a Select");
  }
  return context;
};

const SelectPopoverContext = createContext<boolean | null>(null);

const useSelectPopover = () => {
  const context = useContext(SelectPopoverContext);
  return context ?? false;
};

const SelectItemContext =
  createContext<SelectItemContextProps<SelectValueType> | null>(null);

const useSelectItem = () => {
  const context = useContext(SelectItemContext);
  if (!context) {
    throw new Error("useSelectItem must be used within a SelectItem");
  }
  return context;
};

// Components
export const Select = <T extends SelectValueType>({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  value: valueProp,
  onValueChange: onValueChangeProp,
  disabled,
  invalid,
  options,
  placeholder = "Select...",
  children,
}: SelectProps<T>) => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);
  const [internalValue, setInternalValue] = useState<T>();
  const [selectedValue, setSelectedValue] = useState<T>();
  const [popoverTriggerPosition, setPopoverTriggerPosition] =
    useState<LayoutPosition>();

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const isValueControlled = valueProp !== undefined;
  const value = isValueControlled ? valueProp : internalValue;

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChangeProp?.(nextOpen);
    },
    [onOpenChangeProp]
  );

  const onValueChange = useCallback(
    (nextValue: T) => {
      setInternalValue(nextValue);
      onValueChangeProp?.(nextValue);
    },
    [onValueChangeProp]
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
    setSelectedValue(value);
    onOpenChange(false);
  }, [onOpenChange, value]);

  const ctx = useMemo(
    () => ({
      open,
      onOpenChange,
      disabled,
      value,
      invalid,
      placeholder,
      options,
      selectedValue,
      onValueChange,
      setSelectedValue,
      onConfirm,
      onCancel,
      popoverTriggerPosition,
      setPopoverTriggerPosition,
    }),
    [
      open,
      disabled,
      value,
      options,
      selectedValue,
      invalid,
      placeholder,
      onConfirm,
      onCancel,
      onOpenChange,
      onValueChange,
      popoverTriggerPosition,
    ]
  );

  return (
    <SelectContext.Provider
      value={ctx as SelectContextProps<T | SelectValueType>}
    >
      {children}
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({
  asChild,
  ref: refProp,
  onPress: onPressProp,
  ...props
}: SelectTriggerProps) => {
  const { disabled, open, onOpenChange, setPopoverTriggerPosition } =
    useSelect();

  const ref = useRef<React.ComponentRef<typeof Pressable>>(null);

  const mergedRefs = mergeRefs(ref, refProp);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      onPressProp?.(e);

      ref.current?.measure((_x, _y, width, height, pageX, pageY) => {
        setPopoverTriggerPosition({
          pageX,
          pageY,
          width,
          height,
        });

        onOpenChange(!open);
      });
    },
    [onOpenChange, open, onPressProp, setPopoverTriggerPosition]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <Comp
      {...props}
      disabled={disabled}
      onPress={handlePress}
      ref={mergedRefs}
    />
  );
};

export const SelectInput = ({
  children,
  ...props
}: Partial<React.ComponentProps<typeof ActionInput>>) => {
  const { open, placeholder, options, value, invalid, disabled } = useSelect();

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

  const valueLabel = useMemo(() => {
    return options.find((option) => option.value === value)?.label;
  }, [options, value]);

  return (
    <ActionInput
      {...props}
      disabled={disabled}
      focused={open}
      invalid={invalid}
      placeholder={placeholder}
      value={valueLabel}
    >
      {children as InputAddonChild}

      <InputAddon align="inline-end">
        <InputAddonIcon>
          <AnimatedChevronDown style={animatedStyle} />
        </InputAddonIcon>
      </InputAddon>
    </ActionInput>
  );
};

export const SelectItemLabel = (props: React.ComponentProps<typeof Text>) => {
  return (
    <Text className="flex-1 font-medium text-base text-foreground" {...props} />
  );
};

export const SelectItemIndicator = ({
  className,
  ...props
}: React.ComponentProps<typeof CheckIcon>) => {
  const { value: itemValue } = useSelectItem();
  const { selectedValue } = useSelect();

  if (itemValue !== selectedValue) {
    return null;
  }

  return (
    <CheckIcon className={cn("size-5 text-primary", className)} {...props} />
  );
};

export const SelectItem = <T extends SelectValueType>({
  value,
  label,
  children,
  className,
  ...props
}: SelectItemProps<T>) => {
  const { setSelectedValue, onConfirm } = useSelect();
  const isSelectPopover = useSelectPopover();

  const onPress = useCallback(() => {
    setSelectedValue(value);

    if (isSelectPopover) {
      onConfirm(value);
    }
  }, [setSelectedValue, onConfirm, value, isSelectPopover]);

  return (
    <SelectItemContext.Provider value={{ value }}>
      <Pressable
        className={cn(
          "flex flex-row items-center rounded-lg px-2 py-2 active:bg-accent/90 dark:active:bg-accent/50",
          className
        )}
        onPress={onPress}
        {...props}
      >
        {children ?? (
          <>
            <SelectItemLabel>{label}</SelectItemLabel>

            <SelectItemIndicator />
          </>
        )}
      </Pressable>
    </SelectItemContext.Provider>
  );
};

export const SelectContentSheet = ({
  children,
}: SelectContentProps<SelectValueType>) => {
  const ctx = useSelect();

  return (
    <BottomSheet onOpenChange={ctx.onCancel} open={ctx.open}>
      <BottomSheetPortal>
        <SelectContext.Provider value={ctx}>
          <BottomSheetOverlay />
          <BottomSheetContent>{children}</BottomSheetContent>
        </SelectContext.Provider>
      </BottomSheetPortal>
    </BottomSheet>
  );
};

export const SelectContentSheetHeader = BottomSheetHeader;
export const SelectContentSheetTitle = BottomSheetTitle;
export const SelectContentSheetBody = BottomSheetBody;
export const SelectContentSheetFooter = BottomSheetFooter;

export const SelectContentSheetConfirm = ({
  asChild,
  ...props
}: SelectContentSheetConfirmProps) => {
  const { onConfirm } = useSelect();

  const onPress = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const Comp = asChild ? Slot.Pressable : Pressable;

  return <Comp {...props} onPress={onPress} />;
};

const SelectContentPopoverAnchor = () => {
  const { popoverTriggerPosition } = useSelect();
  const { setTriggerPosition } = usePopover();

  useEffect(() => {
    if (popoverTriggerPosition) {
      setTriggerPosition(popoverTriggerPosition);
    }

    return () => {
      setTriggerPosition(undefined);
    };
  }, [popoverTriggerPosition, setTriggerPosition]);

  return null;
};

export const SelectContentPopover = ({
  width = "trigger",
  ...props
}: SelectContentPopoverProps<SelectValueType>) => {
  const ctx = useSelect();

  return (
    <Popover onOpenChange={ctx.onOpenChange} open={ctx.open}>
      <SelectContentPopoverAnchor />
      <PopoverPortal>
        <SelectPopoverContext.Provider value={true}>
          <SelectContext.Provider value={ctx}>
            <PopoverOverlay className="bg-transparent" />
            <PopoverContent {...props} width={width} />
          </SelectContext.Provider>
        </SelectPopoverContext.Provider>
      </PopoverPortal>
    </Popover>
  );
};
