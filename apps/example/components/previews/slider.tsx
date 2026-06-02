import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function SliderPreview() {
  const [value, setValue] = useState(0);

  return (
    <Slider
      max={100}
      min={0}
      onValueChange={setValue}
      step={10}
      value={value}
    />
  );
}
