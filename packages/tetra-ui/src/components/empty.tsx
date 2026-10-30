import { cva, type VariantProps } from "class-variance-authority";
import { Children, cloneElement } from "react";
import { View } from "react-native";
import { cn } from "@/registry/lib/utils";
import { Text } from "@/registry/ui/text";

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
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center",
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
      className={cn(emptyMediaVariants({ className, variant }))}
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
      className={cn("text-base font-medium tracking-tight", className)}
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
        "text-muted-foreground text-center text-sm/relaxed",
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
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm",
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
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted flex shrink-0 items-center justify-center rounded-full p-2.5",
      },
    },
  }
);
