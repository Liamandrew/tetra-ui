import {
  Host as HostPrimitive,
  Icon as IconPrimitive,
  Text as TextPrimitive,
} from "@expo/ui";
import {
  Button as ButtonPrimitive,
  ControlGroup as ControlGroupPrimitive,
  Divider as DividerPrimitive,
  Menu as MenuPrimitive,
  RNHostView,
  Section as SectionPrimitive,
} from "@expo/ui/swift-ui";
import { disabled as disabledModifier } from "@expo/ui/swift-ui/modifiers";
import { Children, isValidElement, useMemo } from "react";

import type {
  MenuContentProps,
  MenuGroupProps,
  MenuItemIconProps,
  MenuItemLabelProps,
  MenuItemProps,
  MenuProps,
  MenuTriggerProps,
} from "./menu.types";

// Components
export const MenuItem = ({
  variant = "default",
  disabled,
  ...props
}: MenuItemProps) => {
  return (
    <ButtonPrimitive
      modifiers={[disabledModifier(disabled)]}
      {...props}
      role={variant}
    />
  );
};
export const MenuItemLabel = ({ children }: MenuItemLabelProps) => {
  return <TextPrimitive>{children}</TextPrimitive>;
};

export const MenuItemIcon = ({ icon }: MenuItemIconProps) => {
  return <IconPrimitive name={icon} />;
};

export const MenuSeparator = DividerPrimitive;

export const MenuGroup = ({
  direction = "vertical",
  ...props
}: MenuGroupProps) => {
  if (direction === "horizontal") {
    return <ControlGroupPrimitive {...props} label={props.title} />;
  }

  return <SectionPrimitive {...props} />;
};

export const MenuTrigger = ({ children, ...props }: MenuTriggerProps) => {
  return (
    <RNHostView matchContents {...props}>
      {children}
    </RNHostView>
  );
};

MenuTrigger.displayName = "MenuTrigger";

export const MenuContent = ({ children }: MenuContentProps) => {
  return children;
};

MenuContent.displayName = "MenuContent";

export const Menu = ({ children, ...props }: MenuProps) => {
  const { trigger, content } = useMemo(
    () => splitMenuChildren(children),
    [children]
  );

  return (
    <HostPrimitive matchContents>
      <MenuPrimitive {...props} label={trigger}>
        {content}
      </MenuPrimitive>
    </HostPrimitive>
  );
};

export const MenuSubTrigger = ({ children, ...props }: MenuTriggerProps) => {
  return (
    <RNHostView matchContents {...props}>
      {children}
    </RNHostView>
  );
};

MenuSubTrigger.displayName = "MenuSubTrigger";

export const MenuSubContent = ({ children }: MenuContentProps) => {
  return children;
};

MenuSubContent.displayName = "MenuSubContent";

export const MenuSub = ({ children, ...props }: MenuProps) => {
  const { trigger, content } = useMemo(
    () => splitMenuChildren(children, "MenuSubTrigger", "MenuSubContent"),
    [children]
  );

  return (
    <MenuPrimitive {...props} label={trigger}>
      {content}
    </MenuPrimitive>
  );
};

// Utils
const getMenuChildDisplayName = (child: React.ReactNode) => {
  if (!isValidElement(child)) {
    return;
  }

  return (child.type as { displayName?: string }).displayName;
};

const splitMenuChildren = (
  children: React.ReactNode,
  triggerName = "MenuTrigger",
  contentName = "MenuContent"
) => {
  let trigger: React.ReactNode = null;
  let content: React.ReactNode = null;

  Children.forEach(children, (child) => {
    const displayName = getMenuChildDisplayName(child);

    if (displayName === triggerName) {
      trigger = child;
      return;
    }

    if (displayName === contentName) {
      content = child;
      return;
    }
  });

  if (!trigger) {
    throw new Error("Menu must have a trigger");
  }

  if (!content) {
    throw new Error("Menu must have a content");
  }

  return { trigger, content };
};
