import { Button } from "@repo/tetra-ui/components/button";
import { Uniwind, useUniwind } from "uniwind";

export function ThemeToggle() {
  const { theme } = useUniwind();

  return (
    <Button
      onPress={() => Uniwind.setTheme(theme === "light" ? "dark" : "light")}
      variant="link"
    >
      {theme}
    </Button>
  );
}
