import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import { Pressable, View } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

// Types
export type InlineListProps = React.ComponentProps<typeof View> & {
  title?: string;
  children: React.ReactNode;
};

type InlineListItemVariant = "default" | "destructive";

export type InlineListItemProps = React.ComponentProps<typeof Pressable> & {
  children: React.ReactNode;
  showSeparator?: boolean;
  variant?: InlineListItemVariant;
};

export type InlineListItemTitleProps = React.ComponentProps<typeof Text>;
export type InlineListItemDescriptionProps = React.ComponentProps<typeof Text>;

export type InlineListItemAddonProps = React.ComponentProps<typeof View> &
  VariantProps<typeof inlineListItemAddonVariants> & {
    children: React.ReactNode;
  };

type InlineListItemAddonIconProps = {
  children: React.ReactNode;
  className?: string;
};

export type InlineListItemAddonChild =
  | React.ReactElement<InlineListItemAddonProps>
  | null
  | false;

export type InlineListItemAddonChildren =
  | InlineListItemAddonChild
  | InlineListItemAddonChild[];

type InlineListItemAddonAlign = NonNullable<
  VariantProps<typeof inlineListItemAddonVariants>["align"]
>;

// Context
const InlineListItemContext = createContext<InlineListItemVariant>("default");

const useInlineListItemContext = () => useContext(InlineListItemContext);

const InlineListItemAddonContext =
  createContext<InlineListItemAddonAlign>("inline-start");

const useInlineListItemAddonContext = () =>
  useContext(InlineListItemAddonContext);

// Hooks
export const useInlineListItemAddons = (children?: React.ReactNode) => {
  const startAddons: InlineListItemAddonChild[] = [];
  const endAddons: InlineListItemAddonChild[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === InlineListItemAddon) {
      const typedChild = child as InlineListItemAddonChild;

      if (typedChild) {
        if (
          typeof typedChild.props.align === "undefined" ||
          typedChild.props.align === "inline-start"
        ) {
          startAddons.push(typedChild);
        } else {
          endAddons.push(typedChild);
        }
      }
    }
  });

  return {
    startAddons,
    endAddons,
  };
};

const renderItemsWithSeparators = (children: React.ReactNode) => {
  const childArray = Children.toArray(children);
  const itemIndices: number[] = [];

  for (const [index, child] of childArray.entries()) {
    if (isValidElement(child) && child.type === InlineListItem) {
      itemIndices.push(index);
    }
  }

  const lastItemIndex = itemIndices.at(-1);

  return childArray.map((child, index) => {
    if (!isValidElement(child) || child.type !== InlineListItem) {
      return child;
    }

    const itemChild = child as React.ReactElement<InlineListItemProps>;
    const showSeparator =
      itemChild.props.showSeparator ?? index !== lastItemIndex;

    return cloneElement(itemChild, { showSeparator });
  });
};

const parseInlineListItemContent = (children: React.ReactNode) => {
  const content: React.ReactNode[] = [];
  let contentIndex = 0;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === InlineListItemAddon) {
      return;
    }

    if (typeof child === "string") {
      content.push(
        <InlineListItemTitle key={`inline-list-item-title-${contentIndex}`}>
          {child}
        </InlineListItemTitle>
      );
      contentIndex += 1;
      return;
    }

    if (isValidElement(child)) {
      if (child.key == null) {
        content.push(
          cloneElement(child, {
            key: `inline-list-item-content-${contentIndex}`,
          })
        );
        contentIndex += 1;
        return;
      }

      content.push(child);
    }
  });

  return content;
};

// Components
export const InlineList = ({
  title,
  children,
  className,
  ...props
}: InlineListProps) => {
  const items = useMemo(() => renderItemsWithSeparators(children), [children]);

  return (
    <View className={cn("flex w-full flex-col gap-1", className)} {...props}>
      {title ? (
        <Text className="px-4 text-muted-foreground text-xs uppercase tracking-wide">
          {title}
        </Text>
      ) : null}
      <View
        className="w-full overflow-hidden rounded-2xl bg-card"
        data-slot="inline-list"
      >
        {items}
      </View>
    </View>
  );
};

export const InlineListItem = ({
  children,
  className,
  showSeparator = false,
  onPress,
  disabled,
  variant = "default",
  ...props
}: InlineListItemProps) => {
  const { startAddons, endAddons } = useInlineListItemAddons(children);
  const content = useMemo(
    () => parseInlineListItemContent(children),
    [children]
  );

  const rowClassName = cn(inlineListItemVariants({ variant }), className);

  const rowContent = (
    <>
      {startAddons}
      <View className="min-w-0 flex-1 flex-col justify-center gap-1">
        {content}
      </View>
      {endAddons}
    </>
  );

  return (
    <InlineListItemContext.Provider value={variant}>
      <View className="w-full" data-slot="inline-list-item">
        {onPress ? (
          <Pressable
            {...props}
            accessibilityState={{
              disabled: disabled ?? undefined,
              ...props.accessibilityState,
            }}
            className={rowClassName}
            disabled={disabled}
            onPress={onPress}
          >
            {rowContent}
          </Pressable>
        ) : (
          <View className={rowClassName}>{rowContent}</View>
        )}

        {showSeparator ? (
          <View
            className="mx-4 h-hairline bg-border"
            data-slot="inline-list-item-separator"
          />
        ) : null}
      </View>
    </InlineListItemContext.Provider>
  );
};

export const InlineListItemTitle = ({
  className,
  ...props
}: InlineListItemTitleProps) => {
  const variant = useInlineListItemContext();
  return (
    <Text
      className={cn(
        "font-medium text-base text-foreground",
        variant === "destructive" && "font-normal text-destructive",
        className
      )}
      data-slot="inline-list-item-title"
      {...props}
    />
  );
};

export const InlineListItemDescription = ({
  className,
  ...props
}: InlineListItemDescriptionProps) => {
  return (
    <Text
      className={cn("text-muted-foreground text-xs leading-none", className)}
      data-slot="inline-list-item-description"
      {...props}
    />
  );
};

export const InlineListItemAddon = ({
  align,
  className,
  children,
  ...props
}: InlineListItemAddonProps) => {
  const resolvedAlign = align ?? "inline-start";

  return (
    <InlineListItemAddonContext.Provider value={resolvedAlign}>
      <View
        className={cn(inlineListItemAddonVariants({ align }), className)}
        data-slot="inline-list-item-addon"
        {...props}
      >
        {children}
      </View>
    </InlineListItemAddonContext.Provider>
  );
};

export const InlineListItemAddonIcon = ({
  children,
  ...props
}: InlineListItemAddonIconProps): React.ReactElement | null => {
  const variant = useInlineListItemContext();
  const align = useInlineListItemAddonContext();
  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "InlineListItemAddonIcon expects a single React element as children"
      );
    }
    return null;
  }

  return cloneElement(
    child as React.ReactElement<InlineListItemAddonIconProps>,
    {
      ...props,
      className: cn(
        "size-5",
        align === "inline-start"
          ? variant === "destructive"
            ? "text-destructive"
            : "text-foreground"
          : "text-muted-foreground",
        props.className
      ),
    }
  );
};

// Styles
const inlineListItemVariants = cva(
  "min-h-12 w-full flex-row items-center gap-3 px-4 py-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "active:bg-accent/90 dark:active:bg-accent/50",
        destructive: "active:bg-destructive/5 dark:active:bg-destructive/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const inlineListItemAddonVariants = cva(
  "shrink-0 items-center justify-center",
  {
    variants: {
      align: {
        "inline-start": "",
        "inline-end": "",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);
