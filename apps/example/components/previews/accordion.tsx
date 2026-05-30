import { View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionIndicator,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LucideIcon } from "@/components/ui/icons";
import {
  BadgeCheckIcon,
  MailIcon,
  ShoppingCartIcon,
} from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

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

export function AccordionPreview() {
  return (
    <View className="w-full">
      <Accordion collapsible defaultValue="shipping" type="single">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>
              <Stack className="flex-1 items-center" direction="row" gap="sm">
                <item.Icon className="size-5 text-muted-foreground" />
                <Text className="flex-1 font-medium">{item.title}</Text>
              </Stack>
              <AccordionIndicator />
            </AccordionTrigger>
            <AccordionContent>
              <Text className="text-muted-foreground">{item.content}</Text>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
}
