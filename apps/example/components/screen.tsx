import {
  Fab,
  FabIcon,
  type FabProps,
} from "@repo/tetra-ui/components/floating-action-button";
import { EllipsisVerticalIcon } from "@repo/tetra-ui/components/icons";
import { useHeaderHeight as useHeaderHeightElements } from "expo-router/react-navigation";
import { useRef } from "react";
import { Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { cn } from "@/lib/utils";

export const ScreenScrollView = ({
  contentContainerClassName,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollView>) => {
  return (
    <ScrollView
      className="bg-background-muted pb-4"
      contentContainerClassName={cn("flex gap-4", contentContainerClassName)}
      contentInsetAdjustmentBehavior="automatic"
      {...props}
    />
  );
};

export const ScreenHero = ({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof View>) => {
  const heroHeight = useHeroHeight();

  return (
    <View
      className={cn(
        "relative w-full items-center justify-center px-4",
        className
      )}
      style={[{ height: heroHeight }, style]}
      {...props}
    >
      {children}
    </View>
  );
};

export const ScreenActionsButton = ({
  accessibilityLabel = "Behavior",
  ...props
}: Omit<FabProps, "children">) => {
  return (
    <Fab accessibilityLabel={accessibilityLabel} {...props}>
      <FabIcon>
        <EllipsisVerticalIcon />
      </FabIcon>
    </Fab>
  );
};

// https://github.com/react-navigation/react-navigation/issues/12692#issuecomment-3506540022
const useHeaderHeight = (): number => {
  const headerHeight = useHeaderHeightElements();
  const fixedHeight = useRef(headerHeight);

  return Platform.OS === "android" ? fixedHeight.current : headerHeight;
};
export default useHeaderHeight;

const useHeroHeight = () => {
  const headerHeight = useHeaderHeight();
  const { height } = useWindowDimensions();

  return height - headerHeight;
};
