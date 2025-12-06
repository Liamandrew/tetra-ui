import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldControl, FieldLabel } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Stack } from "@/components/ui/stack";
import { TextInput } from "@/components/ui/text-input";

export function CardPreview() {
  return (
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
  );
}
