import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import { Heading } from "@repo/tetra-ui/components/heading";
import { Label } from "@repo/tetra-ui/components/label";
import {
  NativeSheet,
  NativeSheetBody,
  NativeSheetClose,
  NativeSheetContent,
  NativeSheetFooter,
  NativeSheetHeader,
  NativeSheetModal,
  NativeSheetOverlay,
  NativeSheetTitle,
  NativeSheetTrigger,
} from "@repo/tetra-ui/components/native-sheet";
import { Separator } from "@repo/tetra-ui/components/separator";
import { Text } from "react-native";
import ComponentLink from "@/components/component-link";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function Home() {
  return (
    <ScreenScrollView>
      <Section title="Heading">
        <Heading level="1">Heading 1</Heading>
        <Heading level="2">Heading 2</Heading>
        <Heading level="3">Heading 3</Heading>
        <Heading level="4">Heading 4</Heading>
        <Heading level="5">Heading 5</Heading>
        <Heading level="6">Heading 6</Heading>
      </Section>

      <Section title="Label">
        <Label>Label</Label>
      </Section>

      <Section title="Separator">
        <Separator />
        <ComponentLink href="/separator">View More</ComponentLink>
      </Section>

      <Section title="Native Sheet">
        <NativeSheetExample />
        <ComponentLink href="/native-sheet">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}

const NativeSheetExample = () => {
  return (
    <NativeSheet>
      <NativeSheetTrigger asChild>
        <Button>
          <ButtonText>Open</ButtonText>
        </Button>
      </NativeSheetTrigger>
      <NativeSheetModal>
        <NativeSheetOverlay />
        <NativeSheetContent>
          <NativeSheetHeader>
            <NativeSheetTitle>Native Sheet Title</NativeSheetTitle>
          </NativeSheetHeader>
          <NativeSheetBody>
            <Text className="text-foreground">Native Sheet Body</Text>
          </NativeSheetBody>
          <NativeSheetFooter>
            <NativeSheetClose>
              <Button>
                <ButtonText>Close</ButtonText>
              </Button>
            </NativeSheetClose>
          </NativeSheetFooter>
        </NativeSheetContent>
      </NativeSheetModal>
    </NativeSheet>
  );
};
