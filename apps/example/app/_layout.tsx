import { ThemeToggle } from "@/components/theme-toggle";
import "@repo/tetra-ui/globals.css";
import { ThemeProvider } from "@repo/tetra-ui/components/theme";
import { Stack } from "expo-router";
import { configureReanimatedLogger } from "react-native-reanimated";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerRight: () => <ThemeToggle />,
          headerTitle: "",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});
