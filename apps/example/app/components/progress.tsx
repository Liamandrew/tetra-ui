import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@repo/tetra-ui/components/icons";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@repo/tetra-ui/components/progress";
import { Slider } from "@repo/tetra-ui/components/slider";
import { Stack } from "@repo/tetra-ui/components/stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function ProgressScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="w-full bg-background">
        <UploadingProgressExample />
      </ScreenHero>

      <ScreenHero>
        <StepsProgressExample />
      </ScreenHero>

      <ScreenHero>
        <SliderProgressExample />
      </ScreenHero>
    </ScreenScrollView>
  );
}

const UPLOAD_DURATION_MS = 3200;

function UploadingProgressExample() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let frameId = 0;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const nextValue = Math.min(100, (elapsed / UPLOAD_DURATION_MS) * 100);
      setValue(nextValue);

      if (nextValue < 100) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <Progress value={value}>
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

function StepsProgressExample() {
  const [value, setValue] = useState(1);
  return (
    <Stack gap="md">
      <Progress max={5} value={value} variant="steps">
        <ProgressLabel>Step {value} of 5</ProgressLabel>
        <ProgressValue />
      </Progress>

      <Stack direction="row" gap="md">
        <Button
          onPress={() => setValue((prev) => Math.max(0, prev - 1))}
          size="icon-sm"
          variant="outline"
        >
          <ButtonIcon>
            <ChevronLeftIcon />
          </ButtonIcon>
        </Button>

        <Button
          onPress={() => setValue((prev) => Math.min(5, prev + 1))}
          size="icon-sm"
          variant="outline"
        >
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>
    </Stack>
  );
}

function SliderProgressExample() {
  const [value, setValue] = useState(30);

  return (
    <Stack className="w-full" style={{ gap: 24 }}>
      <Progress value={Math.round(value)}>
        <ProgressLabel>Profile setup</ProgressLabel>
        <ProgressValue />
      </Progress>

      <View className="h-15">
        <Slider onValueChange={setValue} value={value} />
      </View>
    </Stack>
  );
}
