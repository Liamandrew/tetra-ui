import { Badge } from "@repo/tetra-ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/tetra-ui/components/card";
import { Text } from "react-native";
import ComponentLink from "@/components/component-link";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function DataDisplay() {
  return (
    <ScreenScrollView>
      <Section title="Badge">
        <Badge>Badge</Badge>
        <ComponentLink href="/badge">View More</ComponentLink>
      </Section>
      <Section className="bg-background/25" title="Card">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Card Content</Text>
          </CardContent>
          <CardFooter>
            <Text>Card Footer</Text>
          </CardFooter>
        </Card>
        <ComponentLink href="/card">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}
