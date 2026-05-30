import {
  Accordion,
  AccordionContent,
  AccordionIndicator,
  AccordionItem,
  AccordionTrigger,
} from "@repo/tetra-ui/components/accordion";
import type { LucideIcon } from "@repo/tetra-ui/components/icons";
import {
  BadgeCheckIcon,
  BellIcon,
  EyeIcon,
  MailIcon,
  ShieldIcon,
  ShoppingCartIcon,
} from "@repo/tetra-ui/components/icons";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { AccordionPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

const FAQ_ITEMS = [
  {
    value: "shipping",
    title: "How long does shipping take?",
    content:
      "Standard shipping takes 2–3 business days. Express options are available at checkout.",
    Icon: ShoppingCartIcon,
  },
  {
    value: "returns",
    title: "What is your return policy?",
    content:
      "You can return unused items within 30 days of delivery for a full refund.",
    Icon: BadgeCheckIcon,
  },
  {
    value: "support",
    title: "How do I contact support?",
    content:
      "Email support@example.com or open a chat from your account settings.",
    Icon: MailIcon,
  },
] as const satisfies Array<{
  value: string;
  title: string;
  content: string;
  Icon: LucideIcon;
}>;

const SETTINGS_ITEMS = [
  {
    value: "notifications",
    title: "Notifications",
    content: "Choose which alerts you receive by email and push.",
    Icon: BellIcon,
  },
  {
    value: "privacy",
    title: "Privacy",
    content: "Manage profile visibility and data sharing preferences.",
    Icon: EyeIcon,
  },
  {
    value: "security",
    title: "Security",
    content: "Update your password and enable two-factor authentication.",
    Icon: ShieldIcon,
  },
] as const satisfies Array<{
  value: string;
  title: string;
  content: string;
  Icon: LucideIcon;
}>;

const AccordionTriggerContent = ({
  Icon,
  title,
}: {
  Icon: LucideIcon;
  title: string;
}) => (
  <Stack className="flex-1 items-center" direction="row" gap="sm">
    <Icon className="size-5 text-muted-foreground" />
    <Text className="flex-1 font-medium">{title}</Text>
  </Stack>
);

export default function AccordionScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <AccordionPreview />
      </ScreenHero>

      <ScreenHero className="items-stretch bg-background">
        <Accordion defaultValue={["notifications", "privacy"]} type="multiple">
          {SETTINGS_ITEMS.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>
                <AccordionTriggerContent Icon={item.Icon} title={item.title} />
                <AccordionIndicator />
              </AccordionTrigger>
              <AccordionContent>
                <Text className="text-muted-foreground">{item.content}</Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScreenHero>

      <ScreenHero className="items-stretch">
        <Accordion collapsible type="single">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>
                <Text className="flex-1 font-medium">{item.title}</Text>
                <AccordionIndicator />
              </AccordionTrigger>
              <AccordionContent>
                <Text className="text-muted-foreground">{item.content}</Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScreenHero>
    </ScreenScrollView>
  );
}
