import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useMemo } from "react";
import { useUniwind } from "uniwind";
import { PortalHost } from "./portal";

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const navigationTheme = useNavigationTheme();

  return (
    <NavigationThemeProvider value={navigationTheme}>
      {children}
      <PortalHost />
    </NavigationThemeProvider>
  );
};

const useNavigationTheme = () => {
  const { theme } = useUniwind();

  return useMemo(() => {
    return theme === "dark" ? DarkTheme : DefaultTheme;
  }, [theme]);
};
