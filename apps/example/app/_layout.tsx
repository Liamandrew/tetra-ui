import { ThemeToggle } from "@/components/theme-toggle";
import "@repo/tetra-ui/globals.css";
import { ThemeProvider } from "@repo/tetra-ui/components/theme";
import { Stack } from "expo-router";
import { configureReanimatedLogger } from "react-native-reanimated";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
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
      </SafeAreaListener>
    </ThemeProvider>
  );
}

configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});
