import { cva, type VariantProps } from "class-variance-authority";
import { Children, cloneElement } from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

// Types
type EmptyMediaProps = React.ComponentProps<typeof View> &
  VariantProps<typeof emptyMediaVariants>;

// Components
export const Empty = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 text-balance rounded-xl border-dashed p-6 text-center",
        className
      )}
      data-slot="empty"
      {...props}
    />
  );
};

export const EmptyHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("flex max-w-sm flex-col items-center gap-0.5", className)}
      data-slot="empty-header"
      {...props}
    />
  );
};

export const EmptyMedia = ({
  className,
  variant = "default",
  ...props
}: EmptyMediaProps) => {
  return (
    <View
      className={cn(emptyMediaVariants({ variant, className }))}
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  );
};

export const EmptyMediaIcon = ({
  children,
  ...props
}: React.ComponentProps<typeof View>) => {
  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "EmptyMediaIcon expects a single React element as children"
      );
    }
    return null;
  }

  return cloneElement(
    child as React.ReactElement<React.ComponentProps<typeof View>>,
    {
      ...props,
      className: cn("size-4", props.className),
    }
  );
};

export const EmptyTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  return (
    <Text
      className={cn("font-medium text-base tracking-tight", className)}
      data-slot="empty-title"
      {...props}
    />
  );
};

export const EmptyDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  return (
    <Text
      className={cn(
        "text-center text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="empty-description"
      {...props}
    />
  );
};

export const EmptyContent = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-2.5 text-balance text-sm",
        className
      )}
      data-slot="empty-content"
      {...props}
    />
  );
};

// Styles
const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex shrink-0 items-center justify-center rounded-full bg-muted p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
