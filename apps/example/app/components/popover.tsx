import { Button } from "@repo/tetra-ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverOverlay,
  PopoverPortal,
  PopoverTrigger,
} from "@repo/tetra-ui/components/popover";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { PopoverPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function PopoverScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero>
        <PopoverPreview />
      </ScreenHero>

      <ScreenHero className="bg-background">
        <Stack className="w-full" gap="md">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                Top
              </Button>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverOverlay />
              <PopoverContent side="top">
                <Text>Popover on top</Text>
              </PopoverContent>
            </PopoverPortal>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                Bottom
              </Button>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverOverlay />
              <PopoverContent side="bottom">
                <Text>Popover on bottom</Text>
              </PopoverContent>
            </PopoverPortal>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                Left
              </Button>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverOverlay />
              <PopoverContent side="left">
                <Text>Popover on left</Text>
              </PopoverContent>
            </PopoverPortal>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                Right
              </Button>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverOverlay />
              <PopoverContent side="right">
                <Text>Popover on right</Text>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
