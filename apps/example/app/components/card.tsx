import { Button } from "@repo/tetra-ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/tetra-ui/components/card";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { CardPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function CardScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="items-stretch">
        <CardPreview />
      </ScreenHero>

      <ScreenHero className="bg-background">
        <Stack direction="row" gap="sm">
          <Card className="flex-1 bg-muted">
            <CardHeader>
              <CardTitle>Basic</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Text className="text-muted-foreground">
                All the features you need to get started
              </Text>
            </CardContent>
            <CardFooter>
              <Button className="self-end" size="sm" variant="link">
                Subscribe
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex-1 bg-muted">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground">
                All the features of Basic, plus more advanced tools
              </Text>
            </CardContent>
            <CardFooter>
              <Button className="self-end" size="sm" variant="link">
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        </Stack>
      </ScreenHero>
    </ScreenScrollView>
  );
}
