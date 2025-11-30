import { Children, cloneElement, isValidElement } from "react";
import type { Pressable as RNPressable, View as RNView } from "react-native";
import { mergeRefs } from "@/lib/utils";

// Constants
const HANDLER_REGEX = /^on[A-Z]/;

// Types
type AnyProps = Record<string, unknown>;

// Components
export const View = ({
  ref,
  children,
  ...viewProps
}: React.ComponentPropsWithRef<typeof RNView>) => {
  const child = Children.only(children) as React.ReactElement<
    React.ComponentPropsWithRef<typeof RNView>
  >;

  if (!isValidElement(child)) {
    console.warn("View expects a single React element as children");
    return null;
  }

  const childRef = "ref" in child ? child.ref : undefined;
  const mergedRef = childRef
    ? mergeRefs(ref, childRef as React.Ref<RNView>)
    : ref;

  return cloneElement(child, {
    ...mergeProps(viewProps, child.props as AnyProps),
    ref: mergedRef,
  });
};

export const Pressable = ({
  ref,
  children,
  ...pressableProps
}: React.ComponentPropsWithRef<typeof RNPressable>) => {
  const child = Children.only(children) as React.ReactElement<
    React.ComponentProps<typeof RNPressable>
  >;

  if (!isValidElement(child)) {
    console.warn("Pressable expects a single React element as children");
    return null;
  }

  const childRef = "ref" in child ? child.ref : undefined;
  const mergedRef = childRef
    ? mergeRefs(ref, childRef as React.Ref<RNView>)
    : ref;

  return cloneElement(child, {
    ...mergeProps(pressableProps, child.props as AnyProps),
    ref: mergedRef,
  });
};

// Utils
function mergeHandler(
  slotPropValue: unknown,
  childPropValue: unknown
): ((...args: unknown[]) => unknown) | unknown {
  if (
    slotPropValue &&
    childPropValue &&
    typeof childPropValue === "function" &&
    typeof slotPropValue === "function"
  ) {
    return (...args: unknown[]) => {
      const result = childPropValue(...args);
      slotPropValue(...args);
      return result;
    };
  }
  return slotPropValue || childPropValue;
}

function mergeStyle(slotPropValue: unknown, childPropValue: unknown) {
  return [slotPropValue, childPropValue];
}

function mergeClassName(slotPropValue: unknown, childPropValue: unknown) {
  return [slotPropValue, childPropValue].filter(Boolean).join(" ");
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    if (!Object.hasOwn(childProps, propName)) {
      continue;
    }

    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    if (HANDLER_REGEX.test(propName)) {
      overrideProps[propName] = mergeHandler(slotPropValue, childPropValue);
    } else if (propName === "style") {
      overrideProps[propName] = mergeStyle(slotPropValue, childPropValue);
    } else if (propName === "className") {
      overrideProps[propName] = mergeClassName(slotPropValue, childPropValue);
    }
  }

  return { ...slotProps, ...overrideProps };
}
