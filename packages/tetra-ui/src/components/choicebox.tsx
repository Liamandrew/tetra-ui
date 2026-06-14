import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type GestureResponderEvent,
  type PressableProps,
  Text,
  View,
} from "react-native";
import { cn } from "../lib/utils";
import { Checkbox } from "./checkbox";
import { InputPressable } from "./input";
import { Radio } from "./radio";
import { Stack, type StackProps } from "./stack";

// Types
type ChoiceboxType = "single" | "multiple";

type ChoiceboxRootContextValue = {
  type: ChoiceboxType;
  disabled?: boolean;
  invalid?: boolean;
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
};

type ChoiceboxItemContextValue = {
  value: string;
  selected: boolean;
  disabled?: boolean;
};

export type ChoiceboxProps = {
  type?: ChoiceboxType;
  /** When `type` is `single`, allow clearing the selected item */
  clearable?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  disabled?: boolean;
  invalid?: boolean;
  direction?: StackProps["direction"];
  className?: string;
  children: React.ReactNode;
};

export type ChoiceboxItemProps = Omit<PressableProps, "children"> & {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export type ChoiceboxItemHeaderProps = React.ComponentProps<typeof View>;
export type ChoiceboxItemTitleProps = React.ComponentProps<typeof Text>;
export type ChoiceboxItemDescriptionProps = React.ComponentProps<typeof Text>;

// Context
const ChoiceboxRootContext = createContext<ChoiceboxRootContextValue | null>(
  null
);

const ChoiceboxItemContext = createContext<ChoiceboxItemContextValue | null>(
  null
);

const useChoiceboxRoot = () => {
  const context = useContext(ChoiceboxRootContext);
  if (!context) {
    throw new Error("Choicebox components must be used within a Choicebox");
  }
  return context;
};

const useChoiceboxItem = () => {
  const context = useContext(ChoiceboxItemContext);
  if (!context) {
    throw new Error(
      "ChoiceboxItem subcomponents must be used within a ChoiceboxItem"
    );
  }
  return context;
};

// Components
export const Choicebox = ({
  type = "single",
  clearable = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  invalid,
  direction = "column",
  className,
  children,
}: ChoiceboxProps) => {
  const isControlled = valueProp !== undefined;

  const [internalSingle, setInternalSingle] = useState<string | undefined>(
    typeof defaultValue === "string" ? defaultValue : undefined
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );

  const singleValue = isControlled
    ? typeof valueProp === "string"
      ? valueProp
      : undefined
    : internalSingle;

  const multipleValues = useMemo(() => {
    if (type !== "multiple") {
      return new Set<string>();
    }
    if (isControlled) {
      return new Set(Array.isArray(valueProp) ? valueProp : []);
    }
    return new Set(internalMultiple);
  }, [type, isControlled, valueProp, internalMultiple]);

  const isSelected = useCallback(
    (itemValue: string) => {
      if (type === "multiple") {
        return multipleValues.has(itemValue);
      }
      return singleValue === itemValue;
    },
    [type, singleValue, multipleValues]
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (disabled) {
        return;
      }

      if (type === "multiple") {
        const next = new Set(multipleValues);
        if (next.has(itemValue)) {
          next.delete(itemValue);
        } else {
          next.add(itemValue);
        }
        const arr = [...next];
        if (!isControlled) {
          setInternalMultiple(arr);
        }
        onValueChange?.(arr);
        return;
      }

      let next: string | undefined;
      if (singleValue === itemValue) {
        next = clearable ? undefined : itemValue;
      } else {
        next = itemValue;
      }
      if (!isControlled) {
        setInternalSingle(next);
      }
      onValueChange?.(next);
    },
    [
      type,
      disabled,
      multipleValues,
      singleValue,
      clearable,
      isControlled,
      onValueChange,
    ]
  );

  const ctx = useMemo(
    () => ({
      type,
      disabled,
      invalid,
      isSelected,
      toggle,
    }),
    [type, disabled, invalid, isSelected, toggle]
  );

  return (
    <ChoiceboxRootContext.Provider value={ctx}>
      <Stack className={cn("w-full", className)} direction={direction} gap="sm">
        {children}
      </Stack>
    </ChoiceboxRootContext.Provider>
  );
};

export const ChoiceboxItem = ({
  value,
  disabled: itemDisabled,
  children,
  className,
  onPress,
  ...props
}: ChoiceboxItemProps) => {
  const {
    type,
    disabled: rootDisabled,
    invalid,
    isSelected,
    toggle,
  } = useChoiceboxRoot();

  const selected = isSelected(value);
  const disabled = rootDisabled || itemDisabled;

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) {
        return;
      }

      onPress?.(event);
      toggle(value);
    },
    [disabled, onPress, toggle, value]
  );

  const itemCtx = useMemo(
    () => ({
      value,
      selected,
      disabled,
    }),
    [value, selected, disabled]
  );

  const accessibilityRole = type === "multiple" ? "checkbox" : "radio";

  const content: React.ReactNode[] = [];
  let indicator: React.ReactNode = null;

  const getContentKey = (child: React.ReactElement) => {
    if (child.type === ChoiceboxItemHeader) {
      return `${value}-header`;
    }

    const typeName =
      typeof child.type === "function" ? child.type.name : String(child.type);

    return `${value}-${typeName || "content"}`;
  };

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ChoiceboxIndicator) {
      indicator = child;
      return;
    }

    if (typeof child === "string") {
      content.push(
        <ChoiceboxItemTitle key={`${value}-label`}>{child}</ChoiceboxItemTitle>
      );
      return;
    }

    if (isValidElement(child)) {
      if (child.key == null) {
        content.push(cloneElement(child, { key: getContentKey(child) }));
        return;
      }

      content.push(child);
    }
  });

  return (
    <ChoiceboxItemContext.Provider value={itemCtx}>
      <InputPressable
        {...props}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ checked: selected, disabled }}
        className={cn(
          "items-start py-3",
          selected && "border-primary",
          className
        )}
        disabled={disabled}
        focused={selected}
        invalid={invalid}
        onPress={handlePress}
      >
        <View className="w-full flex-row items-start gap-3">
          <View className="min-w-0 flex-1">{content}</View>
          <View className="shrink-0">
            {indicator ?? <ChoiceboxIndicator />}
          </View>
        </View>
      </InputPressable>
    </ChoiceboxItemContext.Provider>
  );
};

export const ChoiceboxItemHeader = ({
  className,
  ...props
}: ChoiceboxItemHeaderProps) => {
  return (
    <Stack className={cn("w-full min-w-0", className)} gap="xs" {...props} />
  );
};

export const ChoiceboxItemTitle = ({
  className,
  ...props
}: ChoiceboxItemTitleProps) => {
  return (
    <Text
      className={cn("font-semibold text-base text-foreground", className)}
      {...props}
    />
  );
};

export const ChoiceboxItemDescription = ({
  className,
  ...props
}: ChoiceboxItemDescriptionProps) => {
  return (
    <Text
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

export const ChoiceboxIndicator = () => {
  const { type, invalid } = useChoiceboxRoot();
  const { selected } = useChoiceboxItem();

  if (type === "multiple") {
    return <Checkbox checked={selected} invalid={invalid} />;
  }

  return <Radio checked={selected} invalid={invalid} />;
};
