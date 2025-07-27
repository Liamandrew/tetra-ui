import { Heading } from "@tetra-ui/native/components/heading";
import { Stack } from "@tetra-ui/native/components/stack";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export const Section = ({ title, children }: SectionProps) => {
  return (
    <Stack className="bg-background p-4" gap="sm">
      <Heading level="4">{title}</Heading>
      {children}
    </Stack>
  );
};
