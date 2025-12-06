import { useState } from "react";
import { Pressable } from "react-native";
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <Pressable onPress={() => setChecked((p) => !p)}>
      <Checkbox checked={checked} />
    </Pressable>
  );
}
