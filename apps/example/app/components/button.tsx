import {
  Button,
  ButtonIcon,
  type ButtonProps,
  ButtonText,
} from "@repo/tetra-ui/components/button";
import { ChevronRightIcon } from "@repo/tetra-ui/components/icons";
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
    label: "Small",
    size: "sm",
  },
  {
    label: "Default",
    size: "default",
  },
  {
    label: "Large",
    size: "lg",
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
              <ChevronRightIcon />
            </ButtonIcon>
          </Button>
        </ScreenHero>
      </ScreenScrollView>

      <ComponentBehaviourSheet trigger={<ScreenActionsButton />}>
        <ComponentBehaviourSwitch onValueChange={setDisabled} value={disabled}>
          Set Disabled
        </ComponentBehaviourSwitch>

        <ComponentBehaviourSwitch onValueChange={setBusy} value={busy}>
          Set Busy
        </ComponentBehaviourSwitch>
      </ComponentBehaviourSheet>
    </>
  );
}

const ButtonExample = ({ children, size, ...props }: ButtonProps) => {
  const mapSizeToIconSize = {
    default: "icon",
    lg: "icon-lg",
    sm: "icon-sm",
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
          <ChevronRightIcon />
        </ButtonIcon>
      </Button>
    </Stack>
  );
};
