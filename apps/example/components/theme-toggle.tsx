import { Button } from "@repo/tetra-ui/components/button";
import { useColorScheme } from "nativewind";

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <Button
      onPress={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      variant="link"
    >
      {colorScheme}
    </Button>
  );
}
