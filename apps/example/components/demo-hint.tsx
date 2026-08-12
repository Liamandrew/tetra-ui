import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import { InfoIcon } from "@repo/tetra-ui/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverOverlay,
  PopoverPortal,
  PopoverTrigger,
} from "@repo/tetra-ui/components/popover";
import { Text } from "@repo/tetra-ui/components/text";

type DemoHintProps = {
  children: string;
  accessibilityLabel?: string;
  className?: string;
};

/** Discreet info control for demo-only instructions (hidden unless tapped). */
export function DemoHint({
  children,
  className,
  accessibilityLabel = "Demo tip",
}: DemoHintProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          accessibilityLabel={accessibilityLabel}
          className={className}
          size="icon-sm"
          variant="link"
        >
          <ButtonIcon>
            <InfoIcon className="text-muted-foreground" />
          </ButtonIcon>
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverOverlay />
        <PopoverContent align="end" side="bottom">
          <Text className="text-foreground text-sm">{children}</Text>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
