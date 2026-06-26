import { ChevronRightIcon } from "@repo/tetra-ui/components/icons";
import {
  InlineList,
  InlineListItem,
  InlineListItemAddon,
  InlineListItemAddonIcon,
  InlineListItemTitle,
} from "@repo/tetra-ui/components/inline-list";
import { type Href, router } from "expo-router";
import { ScreenScrollView } from "@/components/screen";

export default function Index() {
  return (
    <ScreenScrollView contentContainerClassName="p-4">
      <InlineList>
        {COMPONENTS.map((component) => (
          <InlineListItem
            key={component.title}
            onPress={() => router.push(component.href)}
          >
            <InlineListItemTitle>{component.title}</InlineListItemTitle>
            <InlineListItemAddon align="inline-end">
              <InlineListItemAddonIcon>
                <ChevronRightIcon />
              </InlineListItemAddonIcon>
            </InlineListItemAddon>
          </InlineListItem>
        ))}
      </InlineList>
    </ScreenScrollView>
  );
}

const COMPONENTS: Array<{ title: string; href: Href }> = [
  { title: "Accordion", href: "/components/accordion" },
  { title: "Action Input", href: "/components/action-input" },
  { title: "Badge", href: "/components/badge" },
  { title: "Bottom Sheet", href: "/components/bottom-sheet" },
  { title: "Button", href: "/components/button" },
  { title: "Card", href: "/components/card" },
  { title: "Checkbox", href: "/components/checkbox" },
  { title: "Choicebox", href: "/components/choicebox" },
  { title: "Chip", href: "/components/chip" },
  { title: "Empty", href: "/components/empty" },
  { title: "Form", href: "/components/form" },
  { title: "Heading", href: "/components/heading" },
  { title: "Inline List", href: "/components/inline-list" },
  { title: "Label", href: "/components/label" },
  { title: "Menu", href: "/components/menu" },
  { title: "Native Sheet", href: "/components/native-sheet" },
  { title: "OTP Input", href: "/components/otp-input" as Href },
  { title: "Password Input", href: "/components/password-input" },
  { title: "Popover", href: "/components/popover" },
  { title: "Progress", href: "/components/progress" },
  { title: "Radio", href: "/components/radio" },
  { title: "Search Input", href: "/components/search-input" },
  { title: "Select", href: "/components/select" },
  { title: "Separator", href: "/components/separator" },
  { title: "Skeleton", href: "/components/skeleton" },
  { title: "Slider", href: "/components/slider" },
  { title: "Switch", href: "/components/switch" },
  { title: "Text Input", href: "/components/text-input" },
  { title: "Textarea Input", href: "/components/textarea-input" },
  { title: "Toast", href: "/components/toast" as Href },
];
