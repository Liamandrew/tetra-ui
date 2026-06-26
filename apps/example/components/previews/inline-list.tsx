import {
  InlineList,
  InlineListItem,
  InlineListItemAddon,
  InlineListItemAddonIcon,
  InlineListItemDescription,
  InlineListItemTitle,
} from "@/components/ui/inline-list";
import {
  ChevronRightIcon,
  MailIcon,
  ShieldIcon,
  ShoppingCartIcon,
} from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";

const handlePress = () => {
  return;
};

export function InlineListPreview() {
  return (
    <Stack className="w-full" gap="lg">
      <InlineList title="Account">
        <InlineListItem onPress={handlePress}>
          <InlineListItemAddon align="inline-start">
            <InlineListItemAddonIcon>
              <MailIcon />
            </InlineListItemAddonIcon>
          </InlineListItemAddon>
          <InlineListItemTitle>Personal Info</InlineListItemTitle>
          <InlineListItemDescription>
            Name, email, phone number
          </InlineListItemDescription>
          <InlineListItemAddon align="inline-end">
            <InlineListItemAddonIcon>
              <ChevronRightIcon />
            </InlineListItemAddonIcon>
          </InlineListItemAddon>
        </InlineListItem>
        <InlineListItem onPress={handlePress}>
          <InlineListItemAddon align="inline-start">
            <InlineListItemAddonIcon>
              <ShoppingCartIcon />
            </InlineListItemAddonIcon>
          </InlineListItemAddon>
          <InlineListItemTitle>Orders</InlineListItemTitle>
          <InlineListItemDescription>
            View history and track shipments
          </InlineListItemDescription>
          <InlineListItemAddon align="inline-end">
            <InlineListItemAddonIcon>
              <ChevronRightIcon />
            </InlineListItemAddonIcon>
          </InlineListItemAddon>
        </InlineListItem>
      </InlineList>

      <InlineList title="Sign In & Security">
        <InlineListItem onPress={handlePress}>
          <InlineListItemAddon align="inline-start">
            <InlineListItemAddonIcon>
              <ShieldIcon />
            </InlineListItemAddonIcon>
          </InlineListItemAddon>
          <InlineListItemTitle>Security</InlineListItemTitle>
          <InlineListItemDescription>Password, 2FA</InlineListItemDescription>
          <InlineListItemAddon align="inline-end">
            <InlineListItemAddonIcon>
              <ChevronRightIcon />
            </InlineListItemAddonIcon>
          </InlineListItemAddon>
        </InlineListItem>
      </InlineList>
    </Stack>
  );
}
