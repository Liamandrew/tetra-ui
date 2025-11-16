import { Heading } from "@repo/tetra-ui/components/heading";
import { Stack } from "@repo/tetra-ui/components/stack";
import { cn } from "@/lib/utils";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const Section = ({ title, children, className }: SectionProps) => {
  return (
    <Stack className={cn("bg-background p-4", className)} gap="sm">
      <Heading level="4">{title}</Heading>
      {children}
    </Stack>
  );
};
