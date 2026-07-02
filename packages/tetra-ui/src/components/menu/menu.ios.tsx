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
  Toggle as TogglePrimitive,
} from "@expo/ui/swift-ui";
import {
  disabled as disabledModifier,
  type ModifierConfig,
} from "@expo/ui/swift-ui/modifiers";
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

// Types
type MenuItemToggleProps = {
  children: React.ReactElement | React.ReactElement[];
  selected: boolean;
  onPress?: () => void;
  modifiers?: ModifierConfig[];
};

// Components
export const MenuItemLabel = ({ children }: MenuItemLabelProps) => {
  return <TextPrimitive>{children}</TextPrimitive>;
};

MenuItemLabel.displayName = "MenuItemLabel";

export const MenuItemIcon = ({ icon }: MenuItemIconProps) => {
  return <IconPrimitive name={icon} />;
};

MenuItemIcon.displayName = "MenuItemIcon";

const MenuItemToggle = ({
  selected,
  onPress,
  children,
  modifiers,
}: MenuItemToggleProps) => {
  const selectableParts = useMemo(
    () => extractSelectableItemParts(children),
    [children]
  );

  return (
    <TogglePrimitive
      isOn={selected}
      label={selectableParts.label}
      modifiers={modifiers}
      onIsOnChange={onPress}
      systemImage={
        typeof selectableParts.systemImage === "string"
          ? selectableParts.systemImage
          : undefined
      }
    />
  );
};
export const MenuItem = ({
  variant = "default",
  disabled,
  selected,
  onPress,
  children,
}: MenuItemProps) => {
  const modifiers = disabled ? [disabledModifier(true)] : undefined;

  if (selected !== undefined) {
    return (
      <MenuItemToggle
        modifiers={modifiers}
        onPress={onPress}
        selected={selected}
      >
        {children}
      </MenuItemToggle>
    );
  }

  return (
    <ButtonPrimitive modifiers={modifiers} onPress={onPress} role={variant}>
      {children}
    </ButtonPrimitive>
  );
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
const extractSelectableItemParts = (
  children: React.ReactElement | React.ReactElement[]
) => {
  let label: string | undefined;
  let systemImage: MenuItemIconProps["icon"] | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const displayName = getMenuChildDisplayName(child);

    if (displayName === "MenuItemIcon") {
      systemImage = (child.props as MenuItemIconProps).icon;
      return;
    }

    if (displayName === "MenuItemLabel") {
      label = (child.props as MenuItemLabelProps).children;
    }
  });

  return { label, systemImage };
};

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
