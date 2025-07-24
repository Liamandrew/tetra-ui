import { Button, type ButtonProps } from "@tetra-ui/native/components/button";
import { Heading } from "@tetra-ui/native/components/heading";
import { ScrollView, View } from "react-native";
import { Section } from "@/components/section";

const buttonExamples: Partial<ButtonProps & { label: string }>[] = [
  {
    label: "Size Small",
    size: "sm",
  },
  {
    label: "Size Default",
    size: "default",
  },
  {
    label: "Size Default Busy",
    size: "default",
    busy: true,
  },
  {
    label: "Size Default Disabled",
    size: "default",
    disabled: true,
  },
];

export default function ButtonScreen() {
  return (
    <ScrollView
      className="bg-background p-4"
      contentContainerClassName="flex gap-4"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Heading level="1">Button</Heading>

      <Section title="Default">
        {buttonExamples.map(({ label, ...props }) => (
          <Button key={label} {...props} variant="default">
            {label}
          </Button>
        ))}
      </Section>

      <Section title="Secondary">
        {buttonExamples.map(({ label, ...props }) => (
          <Button key={label} {...props} variant="secondary">
            {label}
          </Button>
        ))}
      </Section>

      <Section title="Destructive">
        {buttonExamples.map(({ label, ...props }) => (
          <Button key={label} {...props} variant="destructive">
            {label}
          </Button>
        ))}
      </Section>

      <Section title="Outline">
        {buttonExamples.map(({ label, ...props }) => (
          <Button key={label} {...props} variant="outline">
            {label}
          </Button>
        ))}
      </Section>

      <Section title="Ghost">
        {buttonExamples.map(({ label, ...props }) => (
          <Button key={label} {...props} variant="ghost">
            {label}
          </Button>
        ))}
      </Section>

      <Section title="Link">
        {buttonExamples.map(({ label, ...props }) => (
          <View className="h-12" key={label}>
            <Button
              key={label}
              {...props}
              className="self-center"
              variant="link"
            >
              {label}
            </Button>
          </View>
        ))}
      </Section>
    </ScrollView>
  );
}
