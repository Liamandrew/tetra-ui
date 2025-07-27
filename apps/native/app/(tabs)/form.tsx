import { ActionInput } from '@tetra-ui/native/components/action-input';
import { Button } from '@tetra-ui/native/components/button';
import { Checkbox } from '@tetra-ui/native/components/checkbox';
import { PasswordInput } from '@tetra-ui/native/components/password-input';
import { TextInput } from '@tetra-ui/native/components/text-input';
import { TextareaInput } from '@tetra-ui/native/components/textarea-input';
import ComponentLink from '@/components/component-link';
import { ScreenScrollView } from '@/components/screen-scrollview';
import { Section } from '@/components/section';

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
    </ScreenScrollView>
  );
}
