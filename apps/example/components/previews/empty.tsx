import { Button } from "@repo/tetra-ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyMediaIcon,
  EmptyTitle,
} from "@repo/tetra-ui/components/empty";
import { BookOpenIcon } from "@repo/tetra-ui/components/icons";

export function EmptyPreview() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <EmptyMediaIcon>
            <BookOpenIcon />
          </EmptyMediaIcon>
        </EmptyMedia>
        <EmptyTitle>No Projects Found</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating your
          first project.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button className="w-fit" size="sm">
          Create Project
        </Button>
      </EmptyContent>
    </Empty>
  );
}
