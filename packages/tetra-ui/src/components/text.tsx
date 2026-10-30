import { Text as RNText } from "react-native";
import { cn } from "@/registry/lib/utils";

// Components
export const Text = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof RNText>) => {
  return (
    <RNText className={cn("text-foreground font-normal", className)} {...props}>
      {children}
    </RNText>
  );
};
