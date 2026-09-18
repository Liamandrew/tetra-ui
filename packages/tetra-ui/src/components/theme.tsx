import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "@/registry/ui/keyboard";
import { PortalHost } from "@/registry/ui/portal";
import { ScrimHost, ScrimTarget } from "@/registry/ui/scrim";

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <GestureHandlerRootView className="flex-1">
      <KeyboardProvider>
        <ScrimHost>
          <ScrimTarget>{children}</ScrimTarget>
          <PortalHost />
        </ScrimHost>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};
