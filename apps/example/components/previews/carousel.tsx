import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const SLIDES = [
  { className: "bg-sky-800", label: "One" },
  { className: "bg-amber-700", label: "Two" },
  { className: "bg-rose-800", label: "Three" },
];

export function CarouselPreview() {
  return (
    <Carousel className="h-56 w-full">
      <CarouselContent>
        {SLIDES.map((slide) => (
          <CarouselItem key={slide.label}>
            <Stack
              className={cn(
                "h-full items-center justify-center rounded-2xl",
                slide.className
              )}
            >
              <Text className="font-semibold text-white">{slide.label}</Text>
            </Stack>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Stack className="items-center justify-between" direction="row">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </Stack>
    </Carousel>
  );
}
