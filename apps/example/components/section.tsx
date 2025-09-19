import { Heading } from "@repo/tetra-ui/components/heading";
import { Stack } from "@repo/tetra-ui/components/stack";

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
