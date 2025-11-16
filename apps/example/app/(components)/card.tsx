import { Button } from "@repo/tetra-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/tetra-ui/components/card";
import {
  Field,
  FieldControl,
  FieldLabel,
} from "@repo/tetra-ui/components/form";
import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import { Stack } from "@repo/tetra-ui/components/stack";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { Text } from "react-native";
import { ScreenHeading } from "@/components/screen-heading";
import { ScreenScrollView } from "@/components/screen-scrollview";
import { Section } from "@/components/section";

export default function CardScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Card</ScreenHeading>

      <Section className="bg-muted" title="Login Card">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Login to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <Field>
                <FieldLabel>Username</FieldLabel>
                <FieldControl>
                  <TextInput placeholder="Enter your username" />
                </FieldControl>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldControl>
                  <PasswordInput placeholder="Enter your password" />
                </FieldControl>
              </Field>
            </Stack>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Login</Button>
            <Button variant="ghost">Sign Up</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Subscription Cards">
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
      </Section>
    </ScreenScrollView>
  );
}
