import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";

// Components
export const Separator = ({
  className,
  orientation,
  thickness,
  ...props
}: React.ComponentProps<typeof View> &
  VariantProps<typeof separatorVariants>) => {
  return (
    <View
      className={separatorVariants({ className, orientation, thickness })}
      data-slot="separator"
      {...props}
    />
  );
};

// Styles
const separatorVariants = cva("h-10 bg-border", {
  variants: {
    thickness: {
      thin: "",
      thick: "",
    },
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      thickness: "thin",
      class: "h-hairline",
    },
    {
      orientation: "horizontal",
      thickness: "thick",
      class: "h-1",
    },
    {
      orientation: "vertical",
      thickness: "thin",
      class: "w-hairline",
    },
    {
      orientation: "vertical",
      thickness: "thick",
      class: "w-1",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    thickness: "thin",
  },
});
