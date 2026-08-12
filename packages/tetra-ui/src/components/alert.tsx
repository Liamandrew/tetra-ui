import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/utils";

// Types
type AlertVariant = VariantProps<typeof alertVariants>["variant"];

type AlertContextValue = {
  variant: AlertVariant;
};

type AlertProps = React.ComponentProps<typeof View> &
  VariantProps<typeof alertVariants> & {
    children?: React.ReactNode;
  };

type AlertIconProps = {
  children: React.ReactNode;
  className?: string;
};

type ClassNameElement = React.ReactElement<{ className?: string }>;

type AlertSlot = "icon" | "action";

type AlertSlotComponent = {
  displayName?: string;
  slot?: AlertSlot;
};

// Context
const AlertContext = createContext<AlertContextValue | null>(null);

const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("Alert components must be used within an Alert");
  }
  return context;
};

const getAlertSlot = (type: string | React.JSXElementConstructor<unknown>) => {
  if (typeof type === "string") {
    return;
  }

  return (type as AlertSlotComponent).slot;
};

// Components
export const Alert = ({
  children,
  className,
  variant = "default",
  style,
  ...props
}: AlertProps) => {
  const ctx = useMemo(
    () => ({
      variant,
    }),
    [variant]
  );

  const childArray = Children.toArray(children);
  const icons: React.ReactNode[] = [];
  const actions: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];

  for (const child of childArray) {
    if (!isValidElement(child)) {
      content.push(child);
      continue;
    }

    const slot = getAlertSlot(child.type);

    if (slot === "icon") {
      icons.push(child);
      continue;
    }

    if (slot === "action") {
      actions.push(child);
      continue;
    }

    content.push(child);
  }

  const hasAction = actions.length > 0;

  return (
    <AlertContext.Provider value={ctx}>
      <View
        accessibilityRole="alert"
        className={cn(
          alertVariants({ className, variant }),
          hasAction && "pr-24"
        )}
        data-slot="alert"
        style={[
          {
            alignItems: "flex-start",
            flexDirection: "row",
            gap: 8,
          },
          style,
        ]}
        {...props}
      >
        {icons}
        <View
          className="min-w-0 flex-1 gap-0.5"
          style={{
            flexDirection: "column",
            flexGrow: 1,
            flexShrink: 1,
            gap: 2,
            minWidth: 0,
          }}
        >
          {content}
        </View>
        {actions}
      </View>
    </AlertContext.Provider>
  );
};

export const AlertIcon = ({
  children,
  className,
  ...props
}: AlertIconProps) => {
  const { variant } = useAlertContext();
  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error("AlertIcon expects a single React element as children");
    }
    return null;
  }

  const element = child as ClassNameElement;

  return (
    <View className="pt-0.5" data-slot="alert-icon" style={{ flexShrink: 0 }}>
      {cloneElement(element, {
        ...props,
        className: cn(
          alertIconVariants({ variant }),
          className,
          element.props.className
        ),
      })}
    </View>
  );
};
AlertIcon.displayName = "AlertIcon";
AlertIcon.slot = "icon" as const;

export const AlertTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  const { variant } = useAlertContext();

  return (
    <Text
      className={cn(alertTitleVariants({ variant }), className)}
      data-slot="alert-title"
      {...props}
    />
  );
};
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  const { variant } = useAlertContext();

  return (
    <Text
      className={cn(alertDescriptionVariants({ variant }), className)}
      data-slot="alert-description"
      {...props}
    />
  );
};
AlertDescription.displayName = "AlertDescription";

export const AlertAction = ({
  className,
  style,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={className}
      data-slot="alert-action"
      style={[{ position: "absolute", right: 8, top: 8 }, style]}
      {...props}
    />
  );
};
AlertAction.displayName = "AlertAction";
AlertAction.slot = "action" as const;

// Styles
const alertVariants = cva(
  "relative w-full rounded-2xl bg-card px-4 py-3 dark:bg-muted",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "",
        destructive: "",
        info: "",
        success: "",
        warning: "",
      },
    },
  }
);

const alertIconVariants = cva("size-4", {
  variants: {
    variant: {
      default: "text-foreground",
      destructive: "text-destructive",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
    },
  },
});

const alertTitleVariants = cva("font-medium text-sm leading-snug", {
  variants: {
    variant: {
      default: "text-foreground",
      destructive: "text-destructive",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
    },
  },
});

const alertDescriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      destructive: "text-destructive/90",
      info: "text-info/90",
      success: "text-success/90",
      warning: "text-warning/90",
    },
  },
});
