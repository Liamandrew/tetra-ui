import { Button, ButtonText } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ToastPreview() {
  return (
    <Button onPress={() => toast("Event has been created.")}>
      <ButtonText>Show Toast</ButtonText>
    </Button>
  );
}
