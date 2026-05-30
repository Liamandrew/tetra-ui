import type { ComponentPropsWithRef, ComponentRef, ReactNode } from "react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  type PressableProps,
  View,
  type ViewProps,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { cn, mergeRefs } from "@/lib/utils";
import { ChevronDownIcon } from "./icons";
import { Slot } from "./slot";

// Constants
const CONTENT_ENTER = FadeInDown.springify()
  .damping(28)
  .stiffness(340)
  .mass(0.55);
const CONTENT_EXIT = FadeOutUp.duration(120).damping(32).stiffness(380);
const ITEM_LAYOUT = LinearTransition.springify()
  .damping(28)
  .stiffness(340)
  .mass(0.6);
const ICON_SPRING = { damping: 26, stiffness: 320, mass: 0.5 };

const ACCORDION_ITEM_CLASSNAME = cn(
  "my-0 overflow-hidden rounded-none bg-card",
  "data-[layout=open]:my-2 data-[layout=open]:rounded-2xl",
  "data-[layout=closed-only]:rounded-2xl",
  "data-[layout=closed-start]:rounded-t-2xl",
  "data-[layout=closed-end]:rounded-b-2xl"
);

const AnimatedView = Animated.createAnimatedComponent(View);

// Types
type AccordionType = "single" | "multiple";

type AccordionItemLayout =
  | "open"
  | "closed-only"
  | "closed-start"
  | "closed-middle"
  | "closed-end";

type AccordionRootContextValue = {
  type: AccordionType;
  collapsible: boolean;
  itemLayouts: Record<string, AccordionItemLayout>;
  /** single: one value; multiple: open value set */
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
};

type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
  contentId: string;
  triggerId: string;
};

const AccordionRootContext = createContext<AccordionRootContextValue | null>(
  null
);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null
);

const useAccordionRoot = () => {
  const ctx = useContext(AccordionRootContext);
  if (!ctx) {
    throw new Error("Accordion components must be used within Accordion");
  }
  return ctx;
};

const useAccordionItem = () => {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      "AccordionItem, AccordionTrigger, AccordionContent, and AccordionIcon must be used within AccordionItem"
    );
  }
  return ctx;
};

const getAccordionItemValues = (children: ReactNode): string[] => {
  const values: string[] = [];

  Children.forEach(children, (child) => {
    if (
      isValidElement<{ value?: string }>(child) &&
      typeof child.props.value === "string"
    ) {
      values.push(child.props.value);
    }
  });

  return values;
};

const getClosedItemLayout = (
  index: number,
  itemValues: string[],
  isItemOpen: (value: string) => boolean
): AccordionItemLayout => {
  const prevOpen = index === 0 || isItemOpen(itemValues[index - 1] ?? "");
  const nextOpen =
    index === itemValues.length - 1 || isItemOpen(itemValues[index + 1] ?? "");

  if (prevOpen && nextOpen) {
    return "closed-only";
  }
  if (prevOpen) {
    return "closed-start";
  }
  if (nextOpen) {
    return "closed-end";
  }
  return "closed-middle";
};

export type AccordionProps = {
  type?: AccordionType;
  /** When `type` is `single`, allow closing the open item so none are open */
  collapsible?: boolean;
  /** Controlled open value(s) */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  children: ReactNode;
};

export const Accordion = ({
  type = "single",
  collapsible = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
}: AccordionProps) => {
  const itemValues = useMemo(
    () => getAccordionItemValues(children),
    [children]
  );
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

  const isOpen = useCallback(
    (itemValue: string) => {
      if (type === "multiple") {
        return multipleValues.has(itemValue);
      }
      return singleValue === itemValue;
    },
    [type, singleValue, multipleValues]
  );

  const itemLayouts = useMemo(() => {
    const layouts: Record<string, AccordionItemLayout> = {};

    for (let index = 0; index < itemValues.length; index++) {
      const itemValue = itemValues[index] ?? "";

      layouts[itemValue] = isOpen(itemValue)
        ? "open"
        : getClosedItemLayout(index, itemValues, isOpen);
    }

    return layouts;
  }, [itemValues, isOpen]);

  const toggle = useCallback(
    (itemValue: string) => {
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
        next = collapsible ? undefined : itemValue;
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
      multipleValues,
      singleValue,
      collapsible,
      isControlled,
      onValueChange,
    ]
  );

  const ctx = useMemo(
    () => ({
      type,
      collapsible,
      itemLayouts,
      isOpen,
      toggle,
    }),
    [type, collapsible, itemLayouts, isOpen, toggle]
  );

  return (
    <AccordionRootContext.Provider value={ctx}>
      {children}
    </AccordionRootContext.Provider>
  );
};

export type AccordionItemProps = ViewProps & {
  value: string;
  children: ReactNode;
};

export const AccordionItem = ({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) => {
  const root = useAccordionRoot();
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const open = root.isOpen(value);
  const layout = root.itemLayouts[value] ?? "closed-only";

  const itemCtx = useMemo(
    () => ({
      value,
      isOpen: open,
      contentId,
      triggerId,
    }),
    [value, open, contentId, triggerId]
  );

  return (
    <AccordionItemContext.Provider value={itemCtx}>
      <AnimatedView
        className={cn(ACCORDION_ITEM_CLASSNAME, className)}
        data-layout={layout}
        layout={ITEM_LAYOUT}
        {...props}
      >
        {children}
      </AnimatedView>
    </AccordionItemContext.Provider>
  );
};

export type AccordionTriggerProps = Omit<
  ComponentPropsWithRef<typeof Pressable>,
  "children"
> & {
  asChild?: boolean;
  children?: ReactNode;
};

export const AccordionTrigger = ({
  asChild,
  children,
  className,
  onPress,
  ref: refProp,
  ...props
}: AccordionTriggerProps) => {
  const root = useAccordionRoot();
  const item = useAccordionItem();
  const ref = useRef<ComponentRef<typeof Pressable>>(null);
  const mergedRefs = mergeRefs(ref, refProp);

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPress"]>>[0]) => {
      onPress?.(e);
      root.toggle(item.value);
    },
    [onPress, root, item.value]
  );

  const Comp = asChild ? Slot.Pressable : Pressable;

  return (
    <Comp
      accessibilityRole="button"
      accessibilityState={{ expanded: item.isOpen }}
      className={cn(
        "flex flex-row items-center justify-between gap-2 bg-card px-3 py-3 active:opacity-75",
        className
      )}
      nativeID={item.triggerId}
      onPress={handlePress}
      ref={mergedRefs}
      {...props}
    >
      {children}
    </Comp>
  );
};

export type AccordionContentProps = ViewProps & {
  children: ReactNode;
};

export const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionContentProps) => {
  const item = useAccordionItem();

  if (!item.isOpen) {
    return null;
  }

  return (
    <Animated.View
      entering={CONTENT_ENTER}
      exiting={CONTENT_EXIT}
      nativeID={item.contentId}
    >
      <View className={cn("px-3 pt-1 pb-3", className)} {...props}>
        {children}
      </View>
    </Animated.View>
  );
};

export type AccordionIconProps = {
  className?: string;
  children?: ReactNode;
};

export const AccordionIcon = ({ className, children }: AccordionIconProps) => {
  const item = useAccordionItem();
  const rotation = useSharedValue(item.isOpen ? 180 : 0);

  useEffect(() => {
    rotation.value = withSpring(item.isOpen ? 180 : 0, ICON_SPRING);
  }, [item.isOpen, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (children) {
    return (
      <Animated.View className="shrink-0" style={animatedStyle}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <ChevronDownIcon
        className={cn("size-5 shrink-0 text-muted-foreground", className)}
      />
    </Animated.View>
  );
};
