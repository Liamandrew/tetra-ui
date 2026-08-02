import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
} from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";

export function AlertPreview() {
  return (
    <Stack className="w-full" gap="md">
      <Alert>
        <AlertIcon>
          <CircleCheckIcon />
        </AlertIcon>
        <AlertTitle>Account updated successfully</AlertTitle>
        <AlertDescription>
          Your profile information has been saved. Changes will be reflected
          immediately.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertIcon>
          <CircleAlertIcon />
        </AlertIcon>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment method
          and try again.
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertIcon>
          <InfoIcon />
        </AlertIcon>
        <AlertTitle>Dark mode is now available</AlertTitle>
        <AlertDescription>
          Enable it under your profile settings to get started.
        </AlertDescription>
        <AlertAction>
          <Button className="w-fit" size="sm" variant="outline">
            Enable
          </Button>
        </AlertAction>
      </Alert>
    </Stack>
  );
}
