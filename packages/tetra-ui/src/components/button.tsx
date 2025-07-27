import { cn } from '@tetra-ui/native/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

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

// Components
export const Button = ({
  className,
  variant,
  size,
  busy,
  disabled,
  children,
  accessibilityRole = 'button',
  ...props
}: ButtonProps) => {
  const ctx = useMemo(() => {
    return {
      variant,
      size,
      busy,
      disabled,
    };
  }, [variant, size, busy, disabled]);

  return (
    <ButtonContext.Provider value={ctx}>
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityState={{ busy, disabled }}
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && 'opacity-50'
        )}
        disabled={disabled || busy}
        {...props}
      >
        {Children.map(children, (child) => {
          if (typeof child === 'string') {
            if (size === 'icon') {
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
        ctx.busy && 'opacity-0',
        props.className
      )}
    />
  );
};

export const ButtonIcon = (props: ButtonChildProps) => {
  const ctx = useButtonContext();

  const child = Children.only(props.children);

  if (!child) {
    if (__DEV__) {
      throw new Error('ButtonIcon expects a single React element as children');
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<ButtonChildProps>, {
    ...props,
    className: cn(
      buttonIconVariants(ctx),
      ctx.busy && 'opacity-0',
      props.className
    ),
  });
};

const ButtonSpinner = () => {
  const ctx = useButtonContext();

  return (
    <ActivityIndicator className={cn(buttonTextVariants(ctx), 'absolute')} />
  );
};

// Context
const ButtonContext = createContext<InternalButtonContextType | null>(null);

const useButtonContext = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error('useButtonContext must be used within a Button component');
  }
  return context;
};

// Styles
export const buttonVariants = cva(
  'flex w-full shrink-0 flex-row items-center justify-center gap-2.5 whitespace-nowrap rounded-md font-medium text-sm transition-all',
  {
    variants: {
      size: {
        default: 'h-14 px-4',
        sm: 'h-10 gap-1.5 px-3',
        icon: 'size-9',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs active:bg-primary/80',
        destructive:
          'bg-destructive text-white shadow-xs active:bg-destructive/80 dark:bg-destructive/60',
        outline:
          'border border-border bg-background shadow-xs active:bg-accent/90 dark:border-input dark:bg-input/30 dark:active:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs active:bg-secondary/50',
        ghost: 'bg-background active:bg-accent/90 dark:active:bg-accent/50',
        link: 'h-auto w-auto p-0 active:opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const buttonTextVariants = cva('whitespace-nowrap font-bold text-sm', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground dark:text-accent-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-accent-foreground',
      link: 'text-primary',
    },
    size: {
      default: 'text-xl',
      sm: 'text-sm',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const buttonIconVariants = cva('', {
  variants: {
    variant: {
      default: '{}-[stroke]:color-primary-foreground',
      destructive: '{}-[stroke]:color-white',
      outline:
        '{}-[stroke]:color-foreground dark:{}-[stroke]:color-accent-foreground',
      secondary: '{}-[stroke]:color-secondary-foreground',
      ghost: '{}-[stroke]:color-accent-foreground',
      link: '{}-[stroke]:color-primary',
    },
    size: {
      default: 'size-7',
      sm: 'size-6',
      icon: 'size-7',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
