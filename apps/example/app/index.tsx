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
  { href: "/components/accordion", title: "Accordion" },
  { href: "/components/action-input", title: "Action Input" },
  { href: "/components/badge", title: "Badge" },
  { href: "/components/bottom-sheet", title: "Bottom Sheet" },
  { href: "/components/button", title: "Button" },
  { href: "/components/card", title: "Card" },
  { href: "/components/checkbox", title: "Checkbox" },
  { href: "/components/choicebox", title: "Choicebox" },
  { href: "/components/chip", title: "Chip" },
  { href: "/components/empty", title: "Empty" },
  { href: "/components/form", title: "Form" },
  { href: "/components/heading", title: "Heading" },
  { href: "/components/inline-list", title: "Inline List" },
  { href: "/components/label", title: "Label" },
  { href: "/components/menu", title: "Menu" },
  { href: "/components/native-select", title: "Native Select" },
  { href: "/components/native-sheet", title: "Native Sheet" },
  { href: "/components/otp-input" as Href, title: "OTP Input" },
  { href: "/components/password-input", title: "Password Input" },
  { href: "/components/popover", title: "Popover" },
  { href: "/components/progress", title: "Progress" },
  { href: "/components/radio", title: "Radio" },
  { href: "/components/search-input", title: "Search Input" },
  { href: "/components/select", title: "Select" },
  { href: "/components/separator", title: "Separator" },
  { href: "/components/skeleton", title: "Skeleton" },
  { href: "/components/slider", title: "Slider" },
  { href: "/components/switch", title: "Switch" },
  { href: "/components/text-input", title: "Text Input" },
  { href: "/components/textarea-input", title: "Textarea Input" },
  { href: "/components/toast" as Href, title: "Toast" },
];
