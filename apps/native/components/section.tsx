import { Heading } from "@tetra-ui/native/components/heading";
import { Stack } from "@tetra-ui/native/components/stack";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export const Section = ({ title, children }: SectionProps) => {
  return (
    <Stack gap="sm">
      <Heading level="4">{title}</Heading>
      {children}
    </Stack>
  );
};
