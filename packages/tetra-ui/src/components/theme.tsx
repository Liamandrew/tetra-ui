import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "expo-router/react-navigation";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUniwind } from "uniwind";
import { KeyboardProvider } from "./keyboard";
import { PortalHost } from "./portal";

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const navigationTheme = useNavigationTheme();

  return (
    <GestureHandlerRootView className="flex-1">
      <KeyboardProvider>
        <NavigationThemeProvider value={navigationTheme}>
          {children}
          <PortalHost />
        </NavigationThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};

const useNavigationTheme = () => {
  const { theme } = useUniwind();

  return useMemo(() => {
    return theme === "dark" ? DarkTheme : DefaultTheme;
  }, [theme]);
};
