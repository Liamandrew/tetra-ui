import { Text as RNText } from "react-native";
import { cn } from "../lib/utils";

// Components
export const Text = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof RNText>) => {
  return (
    <RNText className={cn("text-foreground", className)} {...props}>
      {children}
    </RNText>
  );
};
