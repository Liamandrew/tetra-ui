import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { cn } from "@/registry/lib/utils";

// Types
type InternalButtonContextType = VariantProps<typeof buttonVariants> & {
  busy?: boolean;
  disabled?: boolean;
};

type ButtonChildProps = {
  children: React.ReactNode;
  className?: string;
};

export type ButtonProps = React.ComponentProps<typeof Pressable> &
  InternalButtonContextType & {
    children: React.ReactNode;
  };

// Context
const ButtonContext = createContext<InternalButtonContextType | null>(null);

const useButtonContext = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error("useButtonContext must be used within a Button component");
  }
  return context;
};

// Components
export const Button = ({
  className,
  variant,
  size,
  busy,
  disabled,
  children,
  accessibilityRole = "button",
  ...props
}: ButtonProps) => {
  const ctx = useMemo(() => {
    return {
      busy,
      disabled,
      size,
      variant,
    };
  }, [variant, size, busy, disabled]);

  return (
    <ButtonContext.Provider value={ctx}>
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityState={{ busy, disabled }}
        className={cn(
          buttonVariants({ className, size, variant }),
          disabled && "opacity-50"
        )}
        disabled={disabled || busy}
        {...props}
      >
        {Children.map(children, (child) => {
          if (typeof child === "string") {
            if (size === "icon") {
              // Icon buttons shouldn't render text
              return null;
            }
            return <ButtonText>{child}</ButtonText>;
          }

          return child;
        })}
        {busy ? <ButtonSpinner /> : null}
      </Pressable>
    </ButtonContext.Provider>
  );
};

export const ButtonText = (props: ButtonChildProps) => {
  const ctx = useButtonContext();

  return (
    <Text
      {...props}
      className={cn(
        buttonTextVariants(ctx),
        ctx.busy && "opacity-0",
        props.className
      )}
    />
  );
};

export const ButtonIcon = ({ children, ...props }: ButtonChildProps) => {
  const ctx = useButtonContext();

  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error("ButtonIcon expects a single React element as children");
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<ButtonChildProps>, {
    ...props,
    className: cn(
      buttonIconVariants(ctx),
      ctx.busy && "opacity-0",
      props.className
    ),
  });
};

const ButtonSpinner = () => {
  const ctx = useButtonContext();

  return (
    <ActivityIndicator
      className="absolute"
      colorClassName={buttonSpinnerVariants(ctx)}
    />
  );
};

// Styles
export const buttonVariants = cva(
  "flex w-full shrink-0 flex-row items-center justify-center gap-2 whitespace-nowrap rounded-lg border-continuous font-medium text-sm",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-12 px-4",
        icon: "size-12",
        "icon-lg": "size-14",
        "icon-sm": "size-8",
        lg: "h-14 px-6",
        sm: "h-8 gap-1 px-3",
      },
      variant: {
        default: "bg-primary active:bg-primary/80",
        destructive:
          "bg-destructive active:bg-destructive/80 dark:bg-destructive/60",
        ghost: "bg-background active:bg-accent/90 dark:active:bg-accent/50",
        link: "h-auto w-auto p-0 active:opacity-50",
        outline:
          "border border-border bg-background active:bg-accent/90 dark:border-input dark:bg-input/30 dark:active:bg-input/50",
        secondary: "bg-secondary active:bg-secondary/50",
      },
    },
  }
);

export const buttonTextVariants = cva(
  "whitespace-nowrap font-semibold text-sm",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "text-lg",
        icon: "",
        "icon-lg": "",
        "icon-sm": "",
        lg: "text-xl",
        sm: "text-sm",
      },
      variant: {
        default: "text-primary-foreground",
        destructive: "text-white",
        ghost: "text-accent-foreground",
        link: "text-primary",
        outline: "text-foreground dark:text-accent-foreground",
        secondary: "text-secondary-foreground",
      },
    },
  }
);

export const buttonIconVariants = cva("", {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: "size-6",
      icon: "size-7",
      "icon-lg": "size-8",
      "icon-sm": "size-6",
      lg: "size-7",
      sm: "size-5",
    },
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      ghost: "text-accent-foreground",
      link: "text-primary",
      outline: "text-foreground dark:text-accent-foreground",
      secondary: "text-secondary-foreground",
    },
  },
});

export const buttonSpinnerVariants = cva("", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "accent-primary-foreground",
      destructive: "accent-white",
      ghost: "accent-accent-foreground",
      link: "accent-primary",
      outline: "accent-foreground dark:accent-accent-foreground",
      secondary: "accent-secondary-foreground",
    },
  },
});
