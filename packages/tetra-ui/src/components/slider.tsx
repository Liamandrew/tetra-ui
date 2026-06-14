import {
  Host as HostPrimitive,
  Slider as SliderPrimitive,
  type SliderProps as SliderPrimitiveProps,
} from "@expo/ui";
import { tint } from "@expo/ui/swift-ui/modifiers";
import { useCSSVariable, withUniwind } from "uniwind";
import { cn } from "@/lib/utils";

// Types
type SliderProps = Omit<SliderPrimitiveProps, "modifiers"> & {
  className?: string;
};

// Components
const StyledHost = withUniwind(HostPrimitive);

export function Slider({
  className,
  max = 100,
  min = 0,
  step = 1,
  ...props
}: SliderProps) {
  const primaryColor = useCSSVariable("--color-primary") as string;

  return (
    <StyledHost className={cn("w-full flex-1", className)}>
      <SliderPrimitive
        {...props}
        max={max}
        min={min}
        modifiers={[tint(primaryColor)]}
        step={step}
      />
    </StyledHost>
  );
}
