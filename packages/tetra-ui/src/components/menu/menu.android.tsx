import { Icon as IconPrimitive } from "@expo/ui";
import {
  Column,
  DropdownMenuItem as DropdownMenuItemPrimitive,
  DropdownMenu as DropdownMenuPrimitive,
  HorizontalDivider as HorizontalDividerPrimitive,
  Host as HostPrimitive,
  RNHostView,
  Row,
  Text as TextPrimitive,
} from "@expo/ui/jetpack-compose";
import {
  defaultMinSize,
  padding,
  width,
  wrapContentWidth,
} from "@expo/ui/jetpack-compose/modifiers";
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
import type { PressableProps } from "react-native";
import { useCSSVariable } from "uniwind";
import type {
  MenuContentProps,
  MenuGroupProps,
  MenuItemIconProps,
  MenuItemLabelProps,
  MenuItemProps,
  MenuItemVariant,
  MenuProps,
  MenuTriggerProps,
} from "./menu.types";

const HORIZONTAL_MENU_ITEM_WIDTH = 48;
const MENU_GROUP_LABEL_MODIFIERS = [padding(12, 8, 12, 4)];
const MENU_GROUP_HORIZONTAL_ROW_MODIFIERS = [
  padding(12, 0, 12, 8),
  wrapContentWidth(),
];

// Types
type InternalMenuAndroidContextType = {
  dismissAll: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

type InternalMenuSubAndroidContextType = {
  dismissAll: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

// Context
const MenuAndroidContext = createContext<InternalMenuAndroidContextType | null>(
  null
);

const useMenuAndroidContext = () => {
  const context = useContext(MenuAndroidContext);
  if (!context) {
    throw new Error(
      "useMenuAndroidContext must be used within a Menu component"
    );
  }
  return context;
};

const MenuSubAndroidContext =
  createContext<InternalMenuSubAndroidContextType | null>(null);

const MenuSubTriggerContext = createContext(false);

const MenuGroupHorizontalContext = createContext(false);

const MenuItemAndroidContext = createContext<MenuItemVariant | null>(null);

const useMenuItemAndroidContext = () => {
  const context = useContext(MenuItemAndroidContext);
  if (!context) {
    throw new Error(
      "useMenuItemAndroidContext must be used within a MenuItem component"
    );
  }
  return context;
};

// Components
export const MenuItem = ({
  variant = "default",
  onPress,
  children,
  disabled,
  ...rest
}: MenuItemProps) => {
  const { dismissAll: dismissRootMenu } = useMenuAndroidContext();
  const subMenu = useContext(MenuSubAndroidContext);
  const isSubTrigger = useContext(MenuSubTriggerContext);
  const isHorizontalGroup = useContext(MenuGroupHorizontalContext);
  const destructiveColor = useCSSVariable("--color-destructive") as string;

  const modifiers = isHorizontalGroup
    ? [
        defaultMinSize({ minHeight: 0, minWidth: 0 }),
        wrapContentWidth(),
        width(HORIZONTAL_MENU_ITEM_WIDTH),
      ]
    : undefined;

  const elementColors =
    variant === "destructive"
      ? {
          disabledLeadingIconColor: destructiveColor,
          disabledTextColor: destructiveColor,
          leadingIconColor: destructiveColor,
          textColor: destructiveColor,
        }
      : undefined;

  const handleClick = useCallback(() => {
    if (isSubTrigger && subMenu) {
      subMenu.setExpanded(true);
      return;
    }

    onPress?.();
    subMenu?.setExpanded(false);
    dismissRootMenu();
  }, [dismissRootMenu, isSubTrigger, onPress, subMenu]);

  return (
    <MenuItemAndroidContext.Provider value={variant}>
      <DropdownMenuItemPrimitive
        {...rest}
        elementColors={elementColors}
        enabled={!disabled}
        modifiers={modifiers}
        onClick={handleClick}
      >
        {children}
      </DropdownMenuItemPrimitive>
    </MenuItemAndroidContext.Provider>
  );
};

export const MenuItemLabel = ({ children }: MenuItemLabelProps) => {
  const variant = useMenuItemAndroidContext();
  const foregroundColor = useCSSVariable(
    variant === "destructive" ? "--color-destructive" : "--color-foreground"
  ) as string;

  return (
    <DropdownMenuItemPrimitive.Text>
      <TextPrimitive color={foregroundColor}>{children}</TextPrimitive>
    </DropdownMenuItemPrimitive.Text>
  );
};

export const MenuItemIcon = ({ icon }: MenuItemIconProps) => {
  const variant = useMenuItemAndroidContext();
  const foregroundColor = useCSSVariable(
    variant === "destructive" ? "--color-destructive" : "--color-foreground"
  ) as string;

  return (
    <DropdownMenuItemPrimitive.LeadingIcon>
      <IconPrimitive color={foregroundColor} name={icon} size={24} />
    </DropdownMenuItemPrimitive.LeadingIcon>
  );
};

export const MenuSeparator = HorizontalDividerPrimitive;

const MenuGroupLabel = ({
  children,
  color,
}: {
  children: string;
  color: string;
}) => {
  return (
    <TextPrimitive color={color} modifiers={MENU_GROUP_LABEL_MODIFIERS}>
      {children}
    </TextPrimitive>
  );
};

export const MenuGroup = ({
  direction = "vertical",
  title,
  children,
}: MenuGroupProps) => {
  const mutedColor = useCSSVariable("--color-muted-foreground") as string;

  if (direction === "horizontal") {
    const row = (
      <MenuGroupHorizontalContext.Provider value={true}>
        <Row
          horizontalArrangement={{ spacedBy: 8 }}
          modifiers={MENU_GROUP_HORIZONTAL_ROW_MODIFIERS}
          verticalAlignment="center"
        >
          {children}
        </Row>
      </MenuGroupHorizontalContext.Provider>
    );

    if (title) {
      return (
        <Column modifiers={[wrapContentWidth()]}>
          <MenuGroupLabel color={mutedColor}>{title}</MenuGroupLabel>
          {row}
        </Column>
      );
    }

    return row;
  }

  if (title) {
    return (
      <Column>
        <MenuGroupLabel color={mutedColor}>{title}</MenuGroupLabel>
        {children}
      </Column>
    );
  }

  return <>{children}</>;
};

export const MenuTrigger = ({ children, ...props }: MenuTriggerProps) => {
  const { setExpanded } = useMenuAndroidContext();

  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error("MenuTrigger expects a single React element as children");
    }
    return null;
  }

  return (
    <DropdownMenuPrimitive.Trigger>
      <RNHostView matchContents {...props}>
        {cloneElement(child as React.ReactElement<PressableProps>, {
          onPress: () => setExpanded(true),
        })}
      </RNHostView>
    </DropdownMenuPrimitive.Trigger>
  );
};

MenuTrigger.displayName = "MenuTrigger";

export const MenuContent = ({ children }: MenuContentProps) => {
  return <DropdownMenuPrimitive.Items>{children}</DropdownMenuPrimitive.Items>;
};

MenuContent.displayName = "MenuContent";

export const Menu = ({ children, ...props }: MenuProps) => {
  const [expanded, setExpanded] = useState(false);
  const popoverColor = useCSSVariable("--color-popover") as string;

  const dismissAll = useCallback(() => setExpanded(false), []);
  const ctx = useMemo(
    () => ({ dismissAll, expanded, setExpanded }),
    [dismissAll, expanded]
  );

  return (
    <MenuAndroidContext.Provider value={ctx}>
      <HostPrimitive matchContents>
        <DropdownMenuPrimitive
          {...props}
          color={popoverColor}
          expanded={expanded}
          onDismissRequest={dismissAll}
        >
          {children}
        </DropdownMenuPrimitive>
      </HostPrimitive>
    </MenuAndroidContext.Provider>
  );
};

export const MenuSubTrigger = ({ children }: MenuTriggerProps) => {
  return (
    <MenuSubTriggerContext.Provider value={true}>
      <DropdownMenuPrimitive.Trigger>{children}</DropdownMenuPrimitive.Trigger>
    </MenuSubTriggerContext.Provider>
  );
};

MenuSubTrigger.displayName = "MenuSubTrigger";

export const MenuSubContent = ({ children }: MenuContentProps) => {
  return <DropdownMenuPrimitive.Items>{children}</DropdownMenuPrimitive.Items>;
};

MenuSubContent.displayName = "MenuSubContent";

export const MenuSub = ({ children }: MenuProps) => {
  const { dismissAll: dismissRootMenu } = useMenuAndroidContext();
  const [expanded, setExpanded] = useState(false);

  const dismissAll = useCallback(() => {
    setExpanded(false);
    dismissRootMenu();
  }, [dismissRootMenu]);

  const { trigger, content } = useMemo(
    () => splitMenuChildren(children, "MenuSubTrigger", "MenuSubContent"),
    [children]
  );

  const ctx = useMemo(
    () => ({ dismissAll, expanded, setExpanded }),
    [dismissAll, expanded]
  );

  return (
    <MenuSubAndroidContext.Provider value={ctx}>
      <DropdownMenuPrimitive
        expanded={expanded}
        onDismissRequest={() => setExpanded(false)}
      >
        {trigger}
        {content}
      </DropdownMenuPrimitive>
    </MenuSubAndroidContext.Provider>
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
