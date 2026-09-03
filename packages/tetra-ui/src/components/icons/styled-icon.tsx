import type { LucideIcon } from "lucide-react-native";
import Svg from "react-native-svg";
import { withUniwind } from "uniwind";
import { cn } from "@/registry/lib/utils";

const styledSvgOptionMapping = {
  height: {
    fromClassName: "className",
    styleProperty: "height",
  },
  style: {
    fromClassName: "className",
  },
  width: {
    fromClassName: "className",
    styleProperty: "width",
  },
} as const;

export const StyledSvg = withUniwind(Svg, styledSvgOptionMapping);

export const createStyledIcon = (Icon: LucideIcon): LucideIcon => {
  const UniwindIcon = withUniwind(Icon, styledSvgOptionMapping);

  const StyledIcon = ({
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

  return StyledIcon as LucideIcon;
};
