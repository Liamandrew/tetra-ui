import type { LucideIcon } from "lucide-react-native";
import Svg from "react-native-svg";
import { withUniwind } from "uniwind";
import { cn } from "@/lib/utils";

const styledSvgOptionMapping = {
  style: {
    fromClassName: "className",
  },
  height: {
    fromClassName: "className",
    styleProperty: "height",
  },
  width: {
    fromClassName: "className",
    styleProperty: "width",
  },
} as const;

export const StyledSvg = withUniwind(Svg, styledSvgOptionMapping);

export const createStyledSvg = (Icon: LucideIcon): LucideIcon => {
  const UniwindIcon = withUniwind(Icon, styledSvgOptionMapping);

  const StyledSvg = ({
    className,
    ...props
  }: React.ComponentProps<typeof UniwindIcon>) => {
    return (
      <UniwindIcon
        className={cn("size-6 text-foreground", className)}
        {...props}
      />
    );
  };

  return StyledSvg as LucideIcon;
};
