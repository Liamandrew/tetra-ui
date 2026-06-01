import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function SwitchPreview() {
  const [value, setvalue] = useState(false);

  return <Switch onValueChange={setvalue} value={value} />;
}
