import { cva, type VariantProps } from 'class-variance-authority';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { Text, View } from 'react-native';
import { cn } from '../lib/utils';

// Types
type InternalBadgeContextType = VariantProps<typeof badgeVariants>;

type BadgeChildProps = {
  children: React.ReactNode;
  className?: string;
};

export type BadgeProps = React.ComponentProps<typeof View> &
  InternalBadgeContextType & {
    children: React.ReactNode;
  };

// Components
export const Badge = ({
  children,
  className,
  variant,
  ...props
}: BadgeProps) => {
  const ctx = useMemo(() => {
    return {
      variant,
    };
  }, [variant]);

  return (
    <BadgeContext.Provider value={ctx}>
      <View className={cn(badgeVariants({ variant, className }))} {...props}>
        {Children.map(children, (child) => {
          if (typeof child === 'string') {
            return <BadgeText>{child}</BadgeText>;
          }

          return child;
        })}
      </View>
    </BadgeContext.Provider>
  );
};

export const BadgeText = (props: BadgeChildProps) => {
  const ctx = useBadgeContext();

  return (
    <Text {...props} className={cn(badgeTextVariants(ctx), props.className)} />
  );
};

export const BadgeIcon = (props: BadgeChildProps) => {
  const ctx = useBadgeContext();

  const child = Children.only(props.children);

  if (!child) {
    if (__DEV__) {
      throw new Error('BadgeIcon expects a single React element as children');
    }
    return null;
  }

  return cloneElement(child as React.ReactElement<BadgeChildProps>, {
    ...props,
    className: cn(badgeIconVariants(ctx), props.className),
  });
};

// Context
const BadgeContext = createContext<InternalBadgeContextType | null>(null);

const useBadgeContext = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadgeContext must be used within a Badge component');
  }
  return context;
};

// Styles
const badgeVariants = cva(
  'flex w-fit shrink-0 flex-row items-center justify-center gap-1.5 self-start overflow-hidden whitespace-nowrap rounded-md border border-border px-2 py-1 font-medium text-xs transition-[color,box-shadow] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary',
        secondary: 'border-transparent bg-secondary',
        destructive: 'border-transparent bg-destructive',
        outline: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('whitespace-nowrap font-semibold text-sm', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeIconVariants = cva('size-4', {
  variants: {
    variant: {
      default: '{}-[stroke]:color-primary-foreground',
      secondary: '{}-[stroke]:color-secondary-foreground',
      destructive: '{}-[stroke]:color-white',
      outline: '{}-[stroke]:color-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
