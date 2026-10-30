import { Text } from "react-native";
import { cn } from "@/registry/lib/utils";

// Types
export type LabelProps = React.ComponentProps<typeof Text>;

// Components
export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <Text className={cn("text-foreground font-semibold", className)} {...props}>
      {children}
    </Text>
  );
};
