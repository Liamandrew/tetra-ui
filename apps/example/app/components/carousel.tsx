import { Button, ButtonText } from "@repo/tetra-ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/tetra-ui/components/carousel";
import { Heading } from "@repo/tetra-ui/components/heading";
import { Stack } from "@repo/tetra-ui/components/stack";
import { Text } from "@repo/tetra-ui/components/text";
import { Stack as RouterStack } from "expo-router";
import { type ReactNode, useState } from "react";
import { ScreenScrollView } from "@/components/screen";
import { cn } from "@/lib/utils";

type Slide = {
  label: string;
  className: string;
  textClassName: string;
};

const PAGE_SLIDES: Slide[] = [
  { className: "bg-sky-800", label: "Northline", textClassName: "text-white" },
  {
    className: "bg-amber-700",
    label: "Harbor Lights",
    textClassName: "text-white",
  },
  {
    className: "bg-rose-800",
    label: "The Glass Hour",
    textClassName: "text-white",
  },
];

const INLINE_SLIDES: Slide[] = [
  ...PAGE_SLIDES,
  {
    className: "bg-emerald-800",
    label: "Redwood",
    textClassName: "text-white",
  },
  {
    className: "bg-violet-800",
    label: "Low Tide",
    textClassName: "text-white",
  },
];

export default function CarouselScreen() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Carousel" }} />
      <ScreenScrollView contentContainerClassName="p-4 pb-8">
        <Stack className="w-full" gap="xl">
          <ExampleBlock
            description="Full-width pages with controls under the track."
            title="Page"
          >
            <Carousel className="h-56 w-full">
              <CarouselContent>
                {PAGE_SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <SlideCard slide={slide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselControls />
            </Carousel>
          </ExampleBlock>

          <ExampleBlock
            description="One card plus a peek of the next."
            title="Inline 1.2"
          >
            <Carousel className="h-44 w-full" variant="inline">
              <CarouselContent>
                {INLINE_SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <SlideCard slide={slide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </ExampleBlock>

          <ExampleBlock
            description="Two even cards in the viewport."
            title="Inline 2"
          >
            <Carousel className="h-44 w-full" perView={2} variant="inline">
              <CarouselContent>
                {INLINE_SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <SlideCard slide={slide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </ExampleBlock>

          <ExampleBlock
            description="Wrap from the last item back to the first."
            title="Loop"
          >
            <Carousel className="h-56 w-full" loop>
              <CarouselContent>
                {PAGE_SLIDES.map((slide) => (
                  <CarouselItem key={`loop-${slide.label}`}>
                    <SlideCard slide={slide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselControls />
            </Carousel>
          </ExampleBlock>

          <ExampleBlock
            description="Advances on an interval. Pauses while you swipe."
            title="Autoplay"
          >
            <Carousel autoplay className="h-56 w-full" loop>
              <CarouselContent>
                {PAGE_SLIDES.map((slide) => (
                  <CarouselItem key={`auto-${slide.label}`}>
                    <SlideCard slide={slide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </ExampleBlock>

          <ExampleBlock
            description="Drive the index from outside the carousel."
            title="Controlled"
          >
            <Carousel
              className="h-56 w-full"
              index={index}
              onIndexChange={setIndex}
            >
              <CarouselContent>
                {PAGE_SLIDES.map((slide) => (
                  <CarouselItem key={`controlled-${slide.label}`}>
                    <SlideCard slide={slide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselControls />
            </Carousel>
            <Stack direction="row" gap="sm">
              {PAGE_SLIDES.map((slide, slideIndex) => (
                <Button
                  key={slide.label}
                  onPress={() => {
                    setIndex(slideIndex);
                  }}
                  size="sm"
                  variant={index === slideIndex ? "default" : "outline"}
                >
                  <ButtonText>{slide.label}</ButtonText>
                </Button>
              ))}
            </Stack>
          </ExampleBlock>
        </Stack>
      </ScreenScrollView>
    </>
  );
}

const ExampleBlock = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <Stack className="w-full" gap="md">
      <Stack gap="xs">
        <Heading level="3">{title}</Heading>
        <Text className="text-muted-foreground">{description}</Text>
      </Stack>
      {children}
    </Stack>
  );
};

const CarouselControls = () => {
  return (
    <Stack className="w-full items-center justify-between" direction="row">
      <CarouselPrevious />
      <CarouselDots />
      <CarouselNext />
    </Stack>
  );
};

const SlideCard = ({ slide }: { slide: Slide }) => {
  return (
    <Stack
      className={cn(
        "h-full items-center justify-center rounded-2xl",
        slide.className
      )}
    >
      <Text className={cn("font-semibold", slide.textClassName)}>
        {slide.label}
      </Text>
    </Stack>
  );
};
