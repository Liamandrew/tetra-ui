import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronRight } from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";

export function ButtonPreview() {
  return (
    <Stack className="items-center" gap="md">
      <Stack direction="row" gap="sm">
        <Button className="w-fit">Default</Button>
        <Button size="icon">
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="secondary">
          Secondary
        </Button>
        <Button size="icon" variant="secondary">
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="destructive">
          Secondary
        </Button>
        <Button size="icon" variant="destructive">
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="outline">
          Outline
        </Button>
        <Button size="icon" variant="outline">
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="ghost">
          Ghost
        </Button>
        <Button size="icon" variant="ghost">
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="link">
          Link
        </Button>
        <Button size="icon" variant="link">
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Stack>
    </Stack>
  );
}
