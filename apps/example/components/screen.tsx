import { useHeaderHeight } from "@react-navigation/elements";
import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import { EllipsisVertical } from "@repo/tetra-ui/components/icons";
import { ScrollView, useWindowDimensions, View } from "react-native";
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
      className={cn("w-full items-center justify-center px-4", className)}
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

const useHeroHeight = () => {
  const headerHeight = useHeaderHeight();
  const { height } = useWindowDimensions();

  return height - headerHeight;
};
