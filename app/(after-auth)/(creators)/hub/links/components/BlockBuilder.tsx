"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { AnyBlock } from "../types";

interface BlockBuilderProps {
  blocks: AnyBlock[];
  onAddBlock: () => void;
  onEditBlock: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: "up" | "down") => void;
  onScrollToPreview: () => void;
}

export function BlockBuilder({
  blocks,
  onAddBlock,
  onEditBlock,
  onRemoveBlock,
  onMoveBlock,
  onScrollToPreview,
}: BlockBuilderProps) {
  const getBlockTypeLabel = (type: AnyBlock["type"]) => {
    const labels: Record<AnyBlock["type"], string> = {
      heading: "Heading",
      paragraph: "Paragraph",
      link: "Link",
      button: "Button",
      image: "Image",
      embed: "Embed",
      spotify: "Spotify",
      list: "List",
      spacer: "Spacer",
      projects: "Projects",
    };
    return labels[type];
  };

  const getBlockPreview = (block: AnyBlock) => {
    switch (block.type) {
      case "heading":
        return `H${block.level}: ${block.text.slice(0, 30)}${block.text.length > 30 ? "..." : ""}`;
      case "paragraph":
        return block.text.slice(0, 40) + (block.text.length > 40 ? "..." : "");
      case "link":
        return block.title;
      case "button":
        return block.label;
      case "image":
        return block.alt || "Image";
      case "embed":
        return block.title || "Embed";
      case "spotify":
        return block.title;
      case "list":
        return `${block.items.length} item(s)`;
      case "spacer":
        return `${block.height}px space`;
      case "projects":
        return `${block.items.length} project(s)`;
      default:
        return "Block";
    }
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Content Blocks
          </h3>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Button onClick={onAddBlock} className="w-full">
            <Plus className="size-4 mr-2" />
            Add Block
          </Button>
          <Button
            variant="outline"
            onClick={onScrollToPreview}
            className="w-full"
          >
            <ExternalLink className="size-4 mr-2" />
            Preview
          </Button>
        </div>

        {/* Blocks list */}
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center py-12 px-4 rounded-lg border border-dashed bg-muted/30">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <Plus className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No blocks yet
              </p>
              <p className="text-sm text-muted-foreground">
                Click &quot;Add Block&quot; to create your first content block
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="group relative rounded-lg border bg-card p-3 hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Block info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground border">
                        {getBlockTypeLabel(block.type)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {getBlockPreview(block)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onEditBlock(block.id)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onRemoveBlock(block.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                    {/* Move buttons */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-6 rounded-full bg-background shadow-sm"
                          onClick={() => onMoveBlock(block.id, "up")}
                        >
                          <ChevronUp className="size-3" />
                        </Button>
                      )}
                      {index < blocks.length - 1 && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-6 rounded-full bg-background shadow-sm"
                          onClick={() => onMoveBlock(block.id, "down")}
                        >
                          <ChevronDown className="size-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
