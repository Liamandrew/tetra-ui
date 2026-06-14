import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

export function ProgressExample() {
  return (
    <Progress max={5} value={3} variant="steps">
      <ProgressLabel>Step 3 of 5</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
