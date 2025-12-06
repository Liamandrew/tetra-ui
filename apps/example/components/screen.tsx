import { useHeaderHeight as useHeaderHeightElements } from "@react-navigation/elements";
import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import { EllipsisVertical } from "@repo/tetra-ui/components/icons";
import { useRef } from "react";
import { Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export const ScreenActionsButton = (
  props: Omit<React.ComponentProps<typeof Button>, "children">
) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <Button
      className="absolute right-4 mb-4 rounded-full shadow-lg"
      size="icon"
      style={{ bottom }}
      {...props}
    >
      <ButtonIcon>
        <EllipsisVertical />
      </ButtonIcon>
    </Button>
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
