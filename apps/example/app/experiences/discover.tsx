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
import { ScreenScrollView } from "@/components/screen";
import { cn } from "@/lib/utils";

type TitleCard = {
  id: string;
  title: string;
  subtitle: string;
  className: string;
  titleClassName: string;
  subtitleClassName: string;
};

const HERO: TitleCard[] = [
  {
    className: "bg-sky-800",
    id: "northline",
    subtitle: "New series",
    subtitleClassName: "text-white/70",
    title: "Northline",
    titleClassName: "text-white",
  },
  {
    className: "bg-amber-700",
    id: "harbor-lights",
    subtitle: "Limited series",
    subtitleClassName: "text-white/70",
    title: "Harbor Lights",
    titleClassName: "text-white",
  },
  {
    className: "bg-rose-800",
    id: "glass-hour",
    subtitle: "Documentary",
    subtitleClassName: "text-white/70",
    title: "The Glass Hour",
    titleClassName: "text-white",
  },
  {
    className: "bg-emerald-800",
    id: "redwood",
    subtitle: "Drama",
    subtitleClassName: "text-white/70",
    title: "Redwood",
    titleClassName: "text-white",
  },
];

const RAIL: TitleCard[] = [
  {
    className: "bg-violet-800",
    id: "low-tide",
    subtitle: "Mystery",
    subtitleClassName: "text-white/70",
    title: "Low Tide",
    titleClassName: "text-white",
  },
  {
    className: "bg-orange-700",
    id: "copper-room",
    subtitle: "Comedy",
    subtitleClassName: "text-white/70",
    title: "The Copper Room",
    titleClassName: "text-white",
  },
  {
    className: "bg-slate-800",
    id: "after-signal",
    subtitle: "Sci-fi",
    subtitleClassName: "text-white/70",
    title: "After Signal",
    titleClassName: "text-white",
  },
  {
    className: "bg-pink-700",
    id: "kindling",
    subtitle: "Romance",
    subtitleClassName: "text-white/70",
    title: "Kindling",
    titleClassName: "text-white",
  },
  {
    className: "bg-teal-800",
    id: "salt-flat",
    subtitle: "Thriller",
    subtitleClassName: "text-white/70",
    title: "Salt Flat",
    titleClassName: "text-white",
  },
  {
    className: "bg-indigo-800",
    id: "paper-town",
    subtitle: "Drama",
    subtitleClassName: "text-white/70",
    title: "Paper Town",
    titleClassName: "text-white",
  },
];

export default function DiscoverExperience() {
  return (
    <>
      <RouterStack.Screen options={{ headerTitle: "Discover" }} />
      <ScreenScrollView contentContainerClassName="pb-8">
        <Stack className="w-full" gap="xl">
          <Carousel autoplay className="h-80 w-full" inset={12} loop>
            <CarouselContent>
              {HERO.map((item) => (
                <CarouselItem key={item.id}>
                  <PosterCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <Stack
              className="w-full items-center justify-between px-4"
              direction="row"
            >
              <CarouselPrevious />
              <CarouselDots />
              <CarouselNext />
            </Stack>
          </Carousel>

          <Stack className="w-full" gap="md">
            <Stack className="px-4" gap="xs">
              <Heading level="3">Because you watched Northline</Heading>
              <Text className="text-muted-foreground">
                More titles in the same mood.
              </Text>
            </Stack>
            <Carousel
              className="h-52 w-full"
              inset={16}
              loop
              perView={1.6}
              variant="inline"
            >
              <CarouselContent>
                {RAIL.map((item) => (
                  <CarouselItem key={item.id}>
                    <PosterCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </Stack>
        </Stack>
      </ScreenScrollView>
    </>
  );
}

const PosterCard = ({ item }: { item: TitleCard }) => {
  return (
    <Stack className={cn("h-full justify-end rounded-2xl p-4", item.className)}>
      <Text className={cn("font-semibold text-lg", item.titleClassName)}>
        {item.title}
      </Text>
      <Text className={item.subtitleClassName}>{item.subtitle}</Text>
    </Stack>
  );
};
