import { ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverOverlay,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function PopoverPreview() {
  return (
    <Stack className="w-full" gap="md">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open</Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverOverlay />
          <PopoverContent align="center" side="top">
            <Text>This is a simple tooltip message</Text>
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open scrollable popover</Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverOverlay />
          <PopoverContent className="h-1/2 p-0" width="50%">
            <ScrollView className="p-4">
              <Stack gap="sm">
                <Text className="font-semibold">Long Content</Text>
                <Text>
                  This popover contains scrollable content. You can scroll
                  through this text to see more information.
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
                <Text>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
                <Text>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </Text>
                <Text>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </Text>
                <Text>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium.
                </Text>
                <Text>
                  Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                  et quasi architecto beatae vitae dicta sunt explicabo.
                </Text>
                <Text>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </Text>
              </Stack>
            </ScrollView>
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open without backdrop</Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent>
            <Text>This popover has no backdrop overlay</Text>
            <PopoverClose asChild>
              <Button size="sm" variant="link">
                Close
              </Button>
            </PopoverClose>
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open rich content</Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverOverlay />
          <PopoverContent width="trigger">
            <Text className="mb-2 font-semibold text-lg">Popover Title</Text>
            <Text className="mb-4 text-sm opacity-70">
              This is a description of what the popover contains.
            </Text>
            <Stack gap="sm">
              <Button size="sm">Action 1</Button>
              <Button size="sm" variant="secondary">
                Action 2
              </Button>
            </Stack>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </Stack>
  );
}
