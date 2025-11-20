import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function PasswordInputScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>PasswordInput</ScreenHeading>

      <Section title="Examples">
        <PasswordInput placeholder="Enter your password" />
        <PasswordInput
          disabled
          placeholder="Enter your password"
          value="Disabled"
        />
        <PasswordInput invalid placeholder="Enter your password" />
      </Section>
    </ScreenScrollView>
  );
}
