"use client";

import { useState } from "react";
import {
  Type,
  AlignLeft,
  Link2,
  MousePointerClick,
  Image,
  Code,
  Music,
  List,
  Space,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnyBlock } from "../types";

interface BlockType {
  type: AnyBlock["type"];
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "content" | "media" | "interactive" | "layout";
}

const blockTypes: BlockType[] = [
  {
    type: "heading",
    label: "Heading",
    description: "Add a title or section header",
    icon: Type,
    category: "content",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Write text content",
    icon: AlignLeft,
    category: "content",
  },
  {
    type: "link",
    label: "Link",
    description: "Add a clickable link with title",
    icon: Link2,
    category: "interactive",
  },
  {
    type: "button",
    label: "Button",
    description: "Create a call-to-action button",
    icon: MousePointerClick,
    category: "interactive",
  },
  {
    type: "image",
    label: "Image",
    description: "Upload or embed an image",
    icon: Image,
    category: "media",
  },
  {
    type: "embed",
    label: "Embed",
    description: "Embed external content",
    icon: Code,
    category: "media",
  },
  {
    type: "spotify",
    label: "Spotify",
    description: "Share music from Spotify",
    icon: Music,
    category: "media",
  },
  {
    type: "list",
    label: "List",
    description: "Create a bulleted or numbered list",
    icon: List,
    category: "content",
  },
  {
    type: "projects",
    label: "Projects",
    description: "Showcase your portfolio projects",
    icon: FolderKanban,
    category: "interactive",
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Add vertical spacing",
    icon: Space,
    category: "layout",
  },
];

interface BlockSelectorProps {
  onSelect: (type: AnyBlock["type"]) => void;
  selectedType?: AnyBlock["type"] | null;
}

export function BlockSelector({ onSelect, selectedType }: BlockSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "all" | "content" | "media" | "interactive" | "layout"
  >("all");

  const filteredBlocks = blockTypes.filter((block) => {
    const matchesSearch =
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || block.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all" as const, label: "All", icon: Sparkles },
    { id: "content" as const, label: "Content", icon: AlignLeft },
    { id: "media" as const, label: "Media", icon: Image },
    {
      id: "interactive" as const,
      label: "Interactive",
      icon: MousePointerClick,
    },
    { id: "layout" as const, label: "Layout", icon: Space },
  ];

  const popularBlocks = ["link", "button", "heading", "image"];
  const isPopularView = activeCategory === "all" && !searchQuery;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <Input
          type="text"
          placeholder="Search block types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="gap-2"
            >
              <Icon className="size-3.5" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Popular Blocks - Quick Access */}
      {isPopularView && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h4 className="text-sm font-medium">Popular Blocks</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {blockTypes
              .filter((block) => popularBlocks.includes(block.type))
              .map((block) => {
                const Icon = block.icon;
                const isSelected = selectedType === block.type;
                return (
                  <button
                    key={block.type}
                    onClick={() => onSelect(block.type)}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-left
                      ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex items-center justify-center size-8 rounded-md transition-all duration-200
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {block.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* All Blocks Label */}
      {isPopularView && (
        <div className="flex items-center gap-2 pt-2">
          <div className="flex-1 border-t" />
          <span className="text-xs text-muted-foreground">All Blocks</span>
          <div className="flex-1 border-t" />
        </div>
      )}

      {/* Block Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredBlocks.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
            No blocks found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredBlocks.map((block) => {
            const Icon = block.icon;
            const isSelected = selectedType === block.type;

            return (
              <button
                key={block.type}
                onClick={() => onSelect(block.type)}
                className={`
                  group relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-border hover:border-foreground/30 hover:shadow-md hover:scale-[1.01]"
                  }
                `}
              >
                <div
                  className={`
                  flex items-center justify-center size-10 rounded-lg transition-all duration-200
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground scale-110"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"
                  }
                `}
                >
                  <Icon className="size-5" />
                </div>

                <div className="space-y-1 flex-1">
                  <h4
                    className={`font-medium text-sm transition-colors duration-200 ${
                      isSelected
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {block.label}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {block.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 animate-in fade-in zoom-in duration-200">
                    <div className="size-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                      <svg
                        className="size-3 text-primary-foreground"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
