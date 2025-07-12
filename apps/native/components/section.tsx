import { Stack } from "@tetra-ui/native/components/stack";
import { Text } from "react-native";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export const Section = ({ title, children }: SectionProps) => {
  return (
    <Stack gap="sm">
      <Text className="font-bold text-2xl text-foreground">{title}</Text>
      {children}
    </Stack>
  );
};
