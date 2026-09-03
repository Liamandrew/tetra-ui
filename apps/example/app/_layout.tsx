import { ThemeToggle } from "@/components/theme-toggle";
import "@repo/tetra-ui/globals.css";
import { ThemeProvider } from "@repo/tetra-ui/components/theme";
import { Toaster } from "@repo/tetra-ui/components/toast";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "expo-router/react-navigation";
import { configureReanimatedLogger } from "react-native-reanimated";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

export default function RootLayout() {
  const { theme } = useUniwind();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={navigationTheme}>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets);
          }}
        >
          <Stack
            screenOptions={{
              headerRight: ThemeToggle,
              headerTitle: "",
            }}
          >
            <Stack.Screen name="index" />
          </Stack>
          <Toaster />
        </SafeAreaListener>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}

configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});
