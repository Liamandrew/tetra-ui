import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import { Moon, Sun } from "@repo/tetra-ui/components/icons";
import { Uniwind, useUniwind } from "uniwind";

export function ThemeToggle() {
  const { theme } = useUniwind();

  const Icon = theme === "light" ? Moon : Sun;

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
