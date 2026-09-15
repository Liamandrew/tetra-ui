import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from "react";
import { Text, View } from "react-native";
import { createSlots } from "@/registry/lib/slots";
import { cn } from "@/registry/lib/utils";

const alertSlots = createSlots<"action" | "icon">({
  errorMessage: "Alert parts must be rendered inside Alert",
});

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

// Context
const AlertContext = createContext<AlertContextValue | null>(null);

const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("Alert components must be used within an Alert");
  }
  return context;
};

const AlertLayout = ({
  children,
  className,
  variant = "default",
  style,
  ...props
}: AlertProps) => {
  const hasAction = alertSlots.useHasSlot("action");

  return (
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
      <alertSlots.Outlet name="icon" />
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
        {children}
      </View>
      <alertSlots.Outlet name="action" />
    </View>
  );
};

// Components
export const Alert = ({
  children,
  variant = "default",
  ...props
}: AlertProps) => {
  const ctx = useMemo(
    () => ({
      variant,
    }),
    [variant]
  );

  return (
    <AlertContext.Provider value={ctx}>
      <alertSlots.Provider>
        <AlertLayout variant={variant} {...props}>
          {children}
        </AlertLayout>
      </alertSlots.Provider>
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
    <alertSlots.Fill name="icon">
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
    </alertSlots.Fill>
  );
};
AlertIcon.displayName = "AlertIcon";

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
    <alertSlots.Fill name="action">
      <View
        className={className}
        data-slot="alert-action"
        style={[{ position: "absolute", right: 8, top: 8 }, style]}
        {...props}
      />
    </alertSlots.Fill>
  );
};
AlertAction.displayName = "AlertAction";

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
