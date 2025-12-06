import {
  Button,
  ButtonIcon,
  type ButtonProps,
  ButtonText,
} from "@repo/tetra-ui/components/button";
import { ChevronRight } from "@repo/tetra-ui/components/icons";
import { Stack } from "@repo/tetra-ui/components/stack";
import { useState } from "react";
import {
  ComponentBehaviourSheet,
  ComponentBehaviourSwitch,
} from "@/components/component-behaviour";
import { ButtonPreview } from "@/components/previews";
import {
  ScreenActionsButton,
  ScreenHero,
  ScreenScrollView,
} from "@/components/screen";

const sizes = [
  {
    size: "sm",
    label: "Small",
  },
  {
    size: "default",
    label: "Default",
  },
  {
    size: "lg",
    label: "Large",
  },
] as const;

export default function ButtonScreen() {
  const [disabled, setDisabled] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <ScreenScrollView>
        <ScreenHero className="bg-background">
          <ButtonPreview />
        </ScreenHero>

        <ScreenHero>
          <Stack className="items-center" gap="md">
            {sizes.map(({ size, label }) => (
              <ButtonExample
                busy={busy}
                disabled={disabled}
                key={size}
                size={size}
                variant="default"
              >
                {label}
              </ButtonExample>
            ))}
          </Stack>
        </ScreenHero>

        <ScreenHero>
          <Button>
            <ButtonText>Continue</ButtonText>
            <ButtonIcon>
              <ChevronRight />
            </ButtonIcon>
          </Button>
        </ScreenHero>
      </ScreenScrollView>

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch
          checked={disabled}
          onCheckedChange={setDisabled}
        >
          Set Disabled
        </ComponentBehaviourSwitch>

        <ComponentBehaviourSwitch checked={busy} onCheckedChange={setBusy}>
          Set Busy
        </ComponentBehaviourSwitch>
      </ComponentBehaviourSheet>
    </>
  );
}

const ButtonExample = ({ children, size, ...props }: ButtonProps) => {
  const mapSizeToIconSize = {
    sm: "icon-sm",
    default: "icon",
    lg: "icon-lg",
  } as const;

  return (
    <Stack direction="row" gap="sm">
      <Button className="w-fit" size={size} {...props}>
        {children}
      </Button>
      <Button
        size={mapSizeToIconSize[size as keyof typeof mapSizeToIconSize]}
        {...props}
      >
        <ButtonIcon>
          <ChevronRight />
        </ButtonIcon>
      </Button>
    </Stack>
  );
};
