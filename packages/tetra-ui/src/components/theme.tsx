import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = (props: ThemeProviderProps) => {
  const navigationTheme = useNavigationTheme();

  return <NavigationThemeProvider value={navigationTheme} {...props} />;
};

const useNavigationTheme = () => {
  const { colorScheme } = useColorScheme();

  return useMemo(() => {
    return colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  }, [colorScheme]);
};
