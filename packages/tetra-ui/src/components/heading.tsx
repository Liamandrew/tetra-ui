import { cva, type VariantProps } from 'class-variance-authority';
import { Text } from 'react-native';
import { cn } from '../lib/utils';

// Types
export type HeadingProps = React.ComponentProps<typeof Text> &
  VariantProps<typeof headingVariants>;

// Components
export const Heading = ({
  children,
  className,
  level,
  ...props
}: HeadingProps) => {
  return (
    <Text className={cn(headingVariants({ className, level }))} {...props}>
      {children}
    </Text>
  );
};

// Styles
const headingVariants = cva('font-bold text-foreground tracking-tight', {
  variants: {
    level: {
      '1': 'text-5xl',
      '2': 'text-4xl',
      '3': 'text-3xl',
      '4': 'text-2xl',
      '5': 'text-xl',
      '6': 'text-lg',
    },
  },
  defaultVariants: {
    level: '1',
  },
});
