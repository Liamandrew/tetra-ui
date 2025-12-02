import { Card, CardContent } from "@repo/tetra-ui/components/card";
import { ChevronRight } from "@repo/tetra-ui/components/icons";
import { Separator } from "@repo/tetra-ui/components/separator";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { type Href, Link } from "expo-router";
import { Fragment } from "react";
import { Pressable, View } from "react-native";
import { ScreenScrollView } from "@/components/screen";

export default function Index() {
  return (
    <ScreenScrollView contentContainerClassName="p-4">
      <Card className="p-0">
        <CardContent className="p-0">
          {COMPONENTS.map((component, index) => (
            <Fragment key={index.toString()}>
              <Link asChild href={component.href}>
                <Pressable className="p-4 active:bg-muted/40">
                  <Stack
                    className="items-center justify-between"
                    direction="row"
                    gap="sm"
                  >
                    <Text className="font-medium text-base">
                      {component.title}
                    </Text>

                    <ChevronRight className="size-5 stroke-muted-foreground" />
                  </Stack>
                </Pressable>
              </Link>

              <View className="px-4">
                <Separator />
              </View>
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </ScreenScrollView>
  );
}

const COMPONENTS: Array<{ title: string; href: Href }> = [
  { title: "Action Input", href: "/components/action-input" },
  { title: "Badge", href: "/components/badge" },
  { title: "Button", href: "/components/button" },
  { title: "Card", href: "/components/card" },
  { title: "Checkbox", href: "/components/checkbox" },
  { title: "Form", href: "/components/form" },
  { title: "Heading", href: "/components/heading" },
  { title: "Label", href: "/components/label" },
  { title: "Native Sheet", href: "/components/native-sheet" },
  { title: "Password Input", href: "/components/password-input" },
  { title: "Popover", href: "/components/popover" },
  { title: "Separator", href: "/components/separator" },
  { title: "Skeleton", href: "/components/skeleton" },
  { title: "Switch", href: "/components/switch" },
  { title: "Text Input", href: "/components/text-input" },
  { title: "Textarea Input", href: "/components/textarea-input" },
];
