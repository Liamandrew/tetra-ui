import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { Stack } from "@/components/ui/stack";

export function ButtonPreview() {
  return (
    <Stack className="items-center" gap="md">
      <Stack direction="row" gap="sm">
        <Button className="w-fit">Default</Button>
        <Button size="icon">
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="secondary">
          Secondary
        </Button>
        <Button size="icon" variant="secondary">
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="destructive">
          Secondary
        </Button>
        <Button size="icon" variant="destructive">
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="outline">
          Outline
        </Button>
        <Button size="icon" variant="outline">
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="ghost">
          Ghost
        </Button>
        <Button size="icon" variant="ghost">
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>

      <Stack direction="row" gap="sm">
        <Button className="w-fit" variant="link">
          Link
        </Button>
        <Button size="icon" variant="link">
          <ButtonIcon>
            <ChevronRightIcon />
          </ButtonIcon>
        </Button>
      </Stack>
    </Stack>
  );
}
