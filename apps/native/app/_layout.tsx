import { ThemeToggle } from "@/components/theme-toggle";
import "@tetra-ui/native/globals.css";
import { ThemeProvider } from "@tetra-ui/native/components/theme";
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
