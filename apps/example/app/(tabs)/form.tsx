import { ActionInput } from "@repo/tetra-ui/components/action-input";
import { Button } from "@repo/tetra-ui/components/button";
import { Checkbox } from "@repo/tetra-ui/components/checkbox";
import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { TextareaInput } from "@repo/tetra-ui/components/textarea-input";
import ComponentLink from "@/components/component-link";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function Form() {
  return (
    <ScreenScrollView>
      <Section title="Button">
        <Button>Button</Button>
        <ComponentLink href="/button">View More</ComponentLink>
      </Section>

      <Section title="TextInput">
        <TextInput placeholder="Enter your username" />
        <ComponentLink href="/text-input">View More</ComponentLink>
      </Section>

      <Section title="TextareaInput">
        <TextareaInput placeholder="Enter your description" />
        <ComponentLink href="/textarea-input">View More</ComponentLink>
      </Section>

      <Section title="PasswordInput">
        <PasswordInput placeholder="Enter your password" />
        <ComponentLink href="/password-input">View More</ComponentLink>
      </Section>

      <Section title="ActionInput">
        <ActionInput placeholder="Enter your address" />
        <ComponentLink href="/action-input">View More</ComponentLink>
      </Section>

      <Section title="Checkbox">
        <Checkbox checked />
        <ComponentLink href="/checkbox">View More</ComponentLink>
      </Section>

      <Section title="Form">
        <ComponentLink href="/(components)/form">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}
