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
  compoundVariants: [
    {
      class: "h-hairline",
      orientation: "horizontal",
      thickness: "thin",
    },
    {
      class: "h-1",
      orientation: "horizontal",
      thickness: "thick",
    },
    {
      class: "w-hairline",
      orientation: "vertical",
      thickness: "thin",
    },
    {
      class: "w-1",
      orientation: "vertical",
      thickness: "thick",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    thickness: "thin",
  },
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
    thickness: {
      thick: "",
      thin: "",
    },
  },
});
