import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@repo/tetra-ui/components/avatar";
import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import { CheckboxInput } from "@repo/tetra-ui/components/checkbox";
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "@repo/tetra-ui/components/choicebox";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
  validateField,
} from "@repo/tetra-ui/components/form";
import { Heading } from "@repo/tetra-ui/components/heading";
import {
  NativeDateSelect,
  NativeDateSelectContent,
  NativeDateSelectInput,
  NativeDateSelectTrigger,
} from "@repo/tetra-ui/components/native-date-select";
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectInput,
  NativeSelectItem,
  NativeSelectTrigger,
} from "@repo/tetra-ui/components/native-select";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@repo/tetra-ui/components/progress";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { TextInput } from "@repo/tetra-ui/components/text-input";
import { TextareaInput } from "@repo/tetra-ui/components/textarea-input";
import { toast } from "@repo/tetra-ui/components/toast";
import { Stack as RouterStack } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ScreenScrollView } from "@/components/screen";

const profileSchema = z.object({
  bio: z.string().max(160, "Keep it under 160 characters").optional(),
  name: z.string().min(2, "Enter your name"),
});

type ProfileValues = z.infer<typeof profileSchema>;

const ROLES = [
  { label: "Designer", value: "designer" },
  { label: "Engineer", value: "engineer" },
  { label: "Product", value: "product" },
  { label: "Founder", value: "founder" },
];

const STEP_LABEL: Record<number, string> = {
  1: "Profile",
  2: "Preferences",
  3: "Choose a plan",
};

export default function OnboardingExperience() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("engineer");
  const [birthday, setBirthday] = useState(new Date(1994, 5, 15));
  const [newsletter, setNewsletter] = useState(true);
  const [plan, setPlan] = useState<string>("pro");
  const [profile, setProfile] = useState<ProfileValues>({
    bio: "Building mobile interfaces with tetra-ui.",
    name: "Alex Rivera",
  });

  const form = useForm<ProfileValues>({
    defaultValues: profile,
    resolver: zodResolver(profileSchema),
  });

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const goToPreferences = form.handleSubmit((data) => {
    setProfile(data);
    setStep(2);
  });

  const finish = () => {
    toast.success("You're all set", {
      description: `${profile.name} joined the ${plan} plan.`,
    });
    setStep(1);
    form.reset(profile);
  };

  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Onboarding" }} />
      <ScreenScrollView contentContainerClassName="p-4 pb-8">
        <Stack className="w-full" gap="lg">
          <Progress max={3} value={step} variant="steps">
            <ProgressLabel>{STEP_LABEL[step]}</ProgressLabel>
            <ProgressValue />
          </Progress>

          {step === 1 ? (
            <Stack gap="lg">
              <Stack className="items-center" gap="sm">
                <Avatar size="lg">
                  <AvatarFallback>{initials || "TU"}</AvatarFallback>
                </Avatar>
                <Stack className="items-center" gap="xs">
                  <Heading level="2">Create your profile</Heading>
                  <Text className="text-center text-muted-foreground">
                    Tell us who you are so we can personalize the experience.
                  </Text>
                </Stack>
              </Stack>

              <Controller
                control={form.control}
                name="name"
                render={({ field, formState }) => (
                  <Field {...validateField(formState.errors, "name")}>
                    <FieldLabel>Full name</FieldLabel>
                    <FieldControl>
                      <TextInput
                        onChangeText={field.onChange}
                        placeholder="Your name"
                        value={field.value}
                      />
                    </FieldControl>
                    <FieldErrorMessage />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="bio"
                render={({ field, formState }) => (
                  <Field {...validateField(formState.errors, "bio")}>
                    <FieldLabel>Bio</FieldLabel>
                    <FieldControl>
                      <TextareaInput
                        onChangeText={field.onChange}
                        placeholder="A short introduction"
                        value={field.value}
                      />
                    </FieldControl>
                    <FieldDescription>
                      Optional · max 160 characters
                    </FieldDescription>
                    <FieldErrorMessage />
                  </Field>
                )}
              />

              <Button onPress={goToPreferences}>
                <ButtonText>Continue</ButtonText>
              </Button>
            </Stack>
          ) : null}

          {step === 2 ? (
            <Stack gap="lg">
              <Stack gap="xs">
                <Heading level="2">Preferences</Heading>
                <Text className="text-muted-foreground">
                  Set your role and birthday for smarter defaults.
                </Text>
              </Stack>

              <Stack gap="xs">
                <Text className="font-medium text-sm">Role</Text>
                <NativeSelect onValueChange={setRole} value={role}>
                  <NativeSelectTrigger asChild>
                    <NativeSelectInput placeholder="Select a role" />
                  </NativeSelectTrigger>
                  <NativeSelectContent>
                    {ROLES.map((item) => (
                      <NativeSelectItem
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </NativeSelectContent>
                </NativeSelect>
              </Stack>

              <Stack gap="xs">
                <Text className="font-medium text-sm">Birthday</Text>
                <NativeDateSelect
                  mode="date"
                  onValueChange={setBirthday}
                  value={birthday}
                >
                  <NativeDateSelectTrigger asChild>
                    <NativeDateSelectInput placeholder="Pick a date" />
                  </NativeDateSelectTrigger>
                  <NativeDateSelectContent />
                </NativeDateSelect>
              </Stack>

              <CheckboxInput
                checked={newsletter}
                onPress={() => setNewsletter((current) => !current)}
              >
                Send me product tips and release notes
              </CheckboxInput>

              <Stack direction="row" gap="sm">
                <Button
                  className="flex-1"
                  onPress={() => setStep(1)}
                  variant="outline"
                >
                  <ButtonText>Back</ButtonText>
                </Button>
                <Button className="flex-1" onPress={() => setStep(3)}>
                  <ButtonText>Continue</ButtonText>
                </Button>
              </Stack>
            </Stack>
          ) : null}

          {step === 3 ? (
            <Stack gap="lg">
              <Stack gap="xs">
                <Heading level="2">Choose a plan</Heading>
                <Text className="text-muted-foreground">
                  You can change this later from settings.
                </Text>
              </Stack>

              <Choicebox
                onValueChange={(value) => {
                  if (typeof value === "string") {
                    setPlan(value);
                  }
                }}
                type="single"
                value={plan}
              >
                <ChoiceboxItem value="free">
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Free</ChoiceboxItemTitle>
                    <ChoiceboxItemDescription>
                      Core components for personal projects
                    </ChoiceboxItemDescription>
                  </ChoiceboxItemHeader>
                </ChoiceboxItem>
                <ChoiceboxItem value="pro">
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Pro</ChoiceboxItemTitle>
                    <ChoiceboxItemDescription>
                      Advanced patterns, priority examples, and more
                    </ChoiceboxItemDescription>
                  </ChoiceboxItemHeader>
                </ChoiceboxItem>
                <ChoiceboxItem value="team">
                  <ChoiceboxItemHeader>
                    <ChoiceboxItemTitle>Team</ChoiceboxItemTitle>
                    <ChoiceboxItemDescription>
                      Shared libraries and collaboration for your org
                    </ChoiceboxItemDescription>
                  </ChoiceboxItemHeader>
                </ChoiceboxItem>
              </Choicebox>

              <Stack direction="row" gap="sm">
                <Button
                  className="flex-1"
                  onPress={() => setStep(2)}
                  variant="outline"
                >
                  <ButtonText>Back</ButtonText>
                </Button>
                <Button className="flex-1" onPress={finish}>
                  <ButtonText>Finish</ButtonText>
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </ScreenScrollView>
    </>
  );
}
