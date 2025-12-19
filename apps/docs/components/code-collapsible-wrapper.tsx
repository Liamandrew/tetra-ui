"use client";

import { Button } from "@repo/shadcn-ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/collapsible";
import { Separator } from "@repo/shadcn-ui/components/separator";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { useState } from "react";

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Collapsible
      className={cn("group/collapsible relative md:-mx-1", className)}
      onOpenChange={setIsOpened}
      open={isOpened}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <div className="absolute top-1.5 right-9 z-10 flex items-center">
          <Button
            className="h-7 rounded-md px-2 text-muted-foreground"
            size="sm"
            variant="ghost"
          >
            {isOpened ? "Collapse" : "Expand"}
          </Button>
          <Separator className="mx-1.5 h-4" orientation="vertical" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="relative mt-6 overflow-hidden data-[state=closed]:max-h-64 [&>figure>div]:max-h-none data-[state=closed]:[&>figure>div]:overflow-hidden [&>figure]:mt-0 [&>figure]:md:mx-0!"
        forceMount
      >
        {children}
      </CollapsibleContent>
      <CollapsibleTrigger className="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-linear-to-b from-fd-card/70 to-fd-card text-muted-foreground text-sm group-data-[state=open]/collapsible:hidden">
        {isOpened ? "Collapse" : "Expand"}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
