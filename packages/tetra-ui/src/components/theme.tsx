import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useMemo } from "react";
import { useUniwind } from "uniwind";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = (props: ThemeProviderProps) => {
  const navigationTheme = useNavigationTheme();

  return <NavigationThemeProvider value={navigationTheme} {...props} />;
};

const useNavigationTheme = () => {
  const { theme } = useUniwind();

  return useMemo(() => {
    return theme === "dark" ? DarkTheme : DefaultTheme;
  }, [theme]);
};
