import { useState } from "react";
import { Pressable } from "react-native";
import { Radio } from "@/components/ui/radio";

export function RadioPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <Pressable onPress={() => setChecked((p) => !p)}>
      <Radio checked={checked} />
    </Pressable>
  );
}
