import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from "react";
import { Pressable, Text } from "react-native";
import { cn } from "../lib/utils";

// Types
type InternalChipContextType = VariantProps<typeof chipVariants> & {
  disabled?: boolean;
};

type ChipChildProps = {
  children: React.ReactNode;
  className?: string;
};

export type ChipProps = React.ComponentProps<typeof Pressable> &
  InternalChipContextType & {
    children: React.ReactNode;
  };

// Context
const ChipContext = createContext<InternalChipContextType | null>(null);

const useChipContext = () => {
  const context = useContext(ChipContext);
  if (!context) {
    throw new Error("useChipContext must be used within a Chip component");
  }
  return context;
};

// Components
export const Chip = ({
  accessibilityRole = "button",
  children,
  className,
  disabled,
  variant,
  ...props
}: ChipProps) => {
  const ctx = useMemo(() => {
    return {
      disabled,
      variant,
    };
  }, [disabled, variant]);

  return (
    <ChipContext.Provider value={ctx}>
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled }}
        className={cn(chipVariants({ variant, className }))}
        {...props}
      >
        {Children.map(children, (child) => {
          if (typeof child === "string") {
            return <ChipText>{child}</ChipText>;
          }

          return child;
        })}
      </Pressable>
    </ChipContext.Provider>
  );
};

export const ChipText = (props: ChipChildProps) => {
  const ctx = useChipContext();

  return (
    <Text {...props} className={cn(chipTextVariants(ctx), props.className)} />
  );
};

export const ChipIcon = ({ children, ...props }: ChipChildProps) => {
  const ctx = useChipContext();

  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error("ChipIcon expects a single React element as children");
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<ChipChildProps>, {
    ...props,
    className: cn(chipIconVariants(ctx), props.className),
  });
};

// Styles
const chipVariants = cva(
  "flex w-fit shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden whitespace-nowrap rounded-full px-2.5 py-1.5 font-medium text-xs",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/80",
        secondary: "bg-secondary active:bg-secondary/50",
        destructive:
          "bg-destructive active:bg-destructive/80 dark:bg-destructive/60",
        outline:
          "border border-border bg-card active:bg-accent/90 dark:border-input dark:bg-input/30 dark:active:bg-input/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const chipTextVariants = cva(
  "whitespace-nowrap font-semibold text-sm leading-tight",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        secondary: "text-secondary-foreground",
        destructive: "text-white",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const chipIconVariants = cva("size-4", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-white",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
