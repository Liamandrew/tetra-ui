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
      className={cn(stackVariants({ className, gap, direction }))}
      {...props}
    >
      {children}
    </View>
  );
};

// Styles
const stackVariants = cva("flex", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5",
      "2xl": "gap-6",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
  },
});
