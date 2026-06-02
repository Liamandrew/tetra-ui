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

export function Slider({ className, ...props }: SliderProps) {
  const primaryColor = useCSSVariable("--color-primary") as string;

  return (
    <StyledHost className={cn("w-full flex-1", className)}>
      <SliderPrimitive {...props} modifiers={[tint(primaryColor)]} />
    </StyledHost>
  );
}
