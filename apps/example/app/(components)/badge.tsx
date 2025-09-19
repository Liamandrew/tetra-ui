import {
  Badge,
  BadgeIcon,
  type BadgeProps,
  BadgeText,
} from "@repo/tetra-ui/components/badge";
import { BadgeCheck } from "@repo/tetra-ui/components/icons";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

const badgeExamples: BadgeProps[] = [
  {
    id: "base",
    children: "Badge",
  },
  {
    id: "with-icon",
    children: (
      <>
        <BadgeIcon>
          <BadgeCheck />
        </BadgeIcon>
        <BadgeText>Badge</BadgeText>
      </>
    ),
  },
] as const;

export default function BadgeScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Badge</ScreenHeading>
      <Section title="Default">
        {badgeExamples.map(({ id, ...props }) => (
          <Badge key={id} {...props} variant="default" />
        ))}
      </Section>

      <Section title="Secondary">
        {badgeExamples.map(({ id, ...props }) => (
          <Badge key={id} {...props} variant="secondary" />
        ))}
      </Section>

      <Section title="Destructive">
        {badgeExamples.map(({ id, ...props }) => (
          <Badge key={id} {...props} variant="destructive" />
        ))}
      </Section>

      <Section title="Outline">
        {badgeExamples.map(({ id, ...props }) => (
          <Badge key={id} {...props} variant="outline" />
        ))}
      </Section>
    </ScreenScrollView>
  );
}
