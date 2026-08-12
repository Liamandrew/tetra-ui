import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@repo/tetra-ui/components/alert";
import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import {
  Field,
  FieldControl,
  FieldErrorMessage,
  FieldLabel,
  validateField,
} from "@repo/tetra-ui/components/form";
import { Heading } from "@repo/tetra-ui/components/heading";
import {
  CircleAlertIcon,
  CircleCheckIcon,
} from "@repo/tetra-ui/components/icons";
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@repo/tetra-ui/components/otp-input";
import { PasswordInput } from "@repo/tetra-ui/components/password-input";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@repo/tetra-ui/components/progress";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { toast } from "@repo/tetra-ui/components/toast";
import { Stack as RouterStack } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DemoHint } from "@/components/demo-hint";
import { ScreenScrollView } from "@/components/screen";

const credentialsSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Credentials = z.infer<typeof credentialsSchema>;

type Step = "credentials" | "otp" | "done";

const STEP_PROGRESS: Record<Step, number> = {
  credentials: 1,
  done: 3,
  otp: 2,
};

const STEP_LABEL: Record<Step, string> = {
  credentials: "Credentials",
  done: "Complete",
  otp: "Verify",
};

export default function SignInExperience() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [otpValue, setOtpValue] = useState("");
  const [otpInvalid, setOtpInvalid] = useState(false);

  const form = useForm<Credentials>({
    defaultValues: {
      email: "alex@tetra-ui.com",
      password: "",
    },
    resolver: zodResolver(credentialsSchema),
  });

  const progressValue = STEP_PROGRESS[step];
  const stepLabel = STEP_LABEL[step];

  const onCredentialsSubmit = form.handleSubmit((data) => {
    if (data.password === "wrong") {
      setErrorMessage("Incorrect password. Please try again.");
      return;
    }

    setErrorMessage(undefined);
    setEmail(data.email);
    setOtpValue("");
    setOtpInvalid(false);
    setStep("otp");
    toast.info("Verification code sent", {
      description: `We sent a 6-digit code to ${data.email}`,
    });
  });

  const completeSignIn = (code: string) => {
    if (code === "000000") {
      setOtpInvalid(true);
      setErrorMessage("That code is invalid. Please try again.");
      return;
    }

    setOtpInvalid(false);
    setErrorMessage(undefined);
    setStep("done");
    toast.success("Signed in", {
      description: "Welcome back.",
    });
  };

  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Sign in" }} />
      <ScreenScrollView contentContainerClassName="p-4 pb-8">
        <Stack className="w-full" gap="lg">
          <Progress max={3} value={progressValue} variant="steps">
            <ProgressLabel>{stepLabel}</ProgressLabel>
            <ProgressValue />
          </Progress>

          {step === "credentials" ? (
            <Stack gap="lg">
              <Stack
                className="items-start justify-between"
                direction="row"
                gap="sm"
              >
                <Stack className="min-w-0 flex-1" gap="xs">
                  <Heading level="2">Welcome back</Heading>
                  <Text className="text-muted-foreground">
                    Sign in with your email, then verify with a one-time code.
                  </Text>
                </Stack>
                <DemoHint className="mt-1.5">
                  Any password works except &quot;wrong&quot;, which shows an
                  error state.
                </DemoHint>
              </Stack>

              {errorMessage ? (
                <Alert variant="destructive">
                  <AlertIcon>
                    <CircleAlertIcon />
                  </AlertIcon>
                  <AlertTitle>Could not sign in</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}

              <Controller
                control={form.control}
                name="email"
                render={({ field, formState }) => (
                  <Field {...validateField(formState.errors, "email")}>
                    <FieldLabel>Email</FieldLabel>
                    <FieldControl>
                      <TextInput
                        autoCapitalize="none"
                        keyboardType="email-address"
                        onChangeText={field.onChange}
                        placeholder="you@example.com"
                        value={field.value}
                      />
                    </FieldControl>
                    <FieldErrorMessage />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field, formState }) => (
                  <Field {...validateField(formState.errors, "password")}>
                    <FieldLabel>Password</FieldLabel>
                    <FieldControl>
                      <PasswordInput
                        onChangeText={field.onChange}
                        placeholder="At least 8 characters"
                        value={field.value}
                      />
                    </FieldControl>
                    <FieldErrorMessage />
                  </Field>
                )}
              />

              <Button onPress={onCredentialsSubmit}>
                <ButtonText>Continue</ButtonText>
              </Button>
            </Stack>
          ) : null}

          {step === "otp" ? (
            <Stack gap="lg">
              <Stack
                className="items-start justify-between"
                direction="row"
                gap="sm"
              >
                <Stack className="min-w-0 flex-1" gap="xs">
                  <Heading level="2">Check your email</Heading>
                  <Text className="text-muted-foreground">
                    Enter the 6-digit code we sent to {email}.
                  </Text>
                </Stack>
                <DemoHint className="mt-1.5">
                  Enter 123456 to continue, or 000000 to see an error state.
                </DemoHint>
              </Stack>

              {errorMessage ? (
                <Alert variant="destructive">
                  <AlertIcon>
                    <CircleAlertIcon />
                  </AlertIcon>
                  <AlertTitle>Invalid code</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="info">
                  <AlertIcon>
                    <CircleCheckIcon />
                  </AlertIcon>
                  <AlertTitle>Code sent</AlertTitle>
                  <AlertDescription>
                    It may take a moment to arrive.
                  </AlertDescription>
                </Alert>
              )}

              <OTPInput
                className="self-center"
                invalid={otpInvalid}
                maxLength={6}
                onComplete={completeSignIn}
                onValueChange={(value) => {
                  setOtpValue(value);
                  setOtpInvalid(false);
                }}
                value={otpValue}
              >
                <OTPInputGroup>
                  <OTPInputSlot index={0} />
                  <OTPInputSlot index={1} />
                  <OTPInputSlot index={2} />
                </OTPInputGroup>
                <OTPInputSeparator />
                <OTPInputGroup>
                  <OTPInputSlot index={3} />
                  <OTPInputSlot index={4} />
                  <OTPInputSlot index={5} />
                </OTPInputGroup>
              </OTPInput>

              <Button
                onPress={() => {
                  setStep("credentials");
                  setErrorMessage(undefined);
                  setOtpValue("");
                }}
                variant="outline"
              >
                <ButtonText>Back</ButtonText>
              </Button>
            </Stack>
          ) : null}

          {step === "done" ? (
            <Stack gap="lg">
              <Alert variant="success">
                <AlertIcon>
                  <CircleCheckIcon />
                </AlertIcon>
                <AlertTitle>You&apos;re in</AlertTitle>
                <AlertDescription>
                  Signed in as {email}. You can continue to your dashboard.
                </AlertDescription>
              </Alert>
              <Button
                onPress={() => {
                  setStep("credentials");
                  setErrorMessage(undefined);
                  setOtpValue("");
                  form.reset({
                    email: "alex@tetra-ui.com",
                    password: "",
                  });
                }}
                variant="outline"
              >
                <ButtonText>Sign in again</ButtonText>
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </ScreenScrollView>
    </>
  );
}
