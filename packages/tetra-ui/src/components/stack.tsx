import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";
import { cn } from "../lib/utils";

// Types
export type StackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof stackVariants>;

// Components
export const Stack = ({
  children,
  className,
  gap,
  direction,
  ...props
}: StackProps) => {
  return (
    <View
      className={cn(stackVariants({ className, direction, gap }))}
      {...props}
    >
      {children}
    </View>
  );
};

// Styles
const stackVariants = cva("flex", {
  variants: {
    direction: {
      column: "flex-col",
      "column-reverse": "flex-col-reverse",
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
    },
    gap: {
      "2xl": "gap-6",
      lg: "gap-4",
      md: "gap-3",
      none: "gap-0",
      sm: "gap-2",
      xl: "gap-5",
      xs: "gap-1",
    },
  },
});
