import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "@/registry/ui/keyboard";
import { PortalHost } from "@/registry/ui/portal";

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
