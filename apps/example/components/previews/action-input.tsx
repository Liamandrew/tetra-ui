import { ActionInput } from "@/components/ui/action-input";
import { BadgeCheckIcon } from "@/components/ui/icons";
import { InputAddon, InputAddonIcon } from "@/components/ui/input";

export function ActionInputPreview() {
  return (
    <ActionInput placeholder="Enter your address">
      <InputAddon>
        <InputAddonIcon>
          <BadgeCheckIcon />
        </InputAddonIcon>
      </InputAddon>
    </ActionInput>
  );
}
