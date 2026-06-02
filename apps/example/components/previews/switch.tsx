import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function SwitchPreview() {
  const [value, setValue] = useState(false);

  return <Switch onValueChange={setValue} value={value} />;
}
