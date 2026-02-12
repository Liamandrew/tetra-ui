import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import { MoonIcon, SunIcon } from "@repo/tetra-ui/components/icons";
import { Uniwind, useUniwind } from "uniwind";

export function ThemeToggle() {
  const { theme } = useUniwind();

  const Icon = theme === "light" ? MoonIcon : SunIcon;

  return (
    <Button
      onPress={() => Uniwind.setTheme(theme === "light" ? "dark" : "light")}
      size="icon"
      variant="link"
    >
      <ButtonIcon>
        <Icon />
      </ButtonIcon>
    </Button>
  );
}
