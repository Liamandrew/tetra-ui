import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "./keyboard";
import { PortalHost } from "./portal";

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <GestureHandlerRootView className="flex-1">
      <KeyboardProvider>
        {children}
        <PortalHost />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};
