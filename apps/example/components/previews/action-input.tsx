import { ActionInput } from "@/components/ui/action-input";
import { BadgeCheck } from "@/components/ui/icons";
import { InputAddon, InputAddonIcon } from "@/components/ui/input";

export function ActionInputPreview() {
  return (
    <ActionInput placeholder="Enter your address">
      <InputAddon>
        <InputAddonIcon>
          <BadgeCheck />
        </InputAddonIcon>
      </InputAddon>
    </ActionInput>
  );
}
