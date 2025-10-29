import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon, FolderCode, LayoutTemplate } from "lucide-react";

export default function CreatorPage() {
  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutTemplate />
          </EmptyMedia>
          <EmptyTitle>No Page Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any page yet. Get started by creating your
            page.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Get Started</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
