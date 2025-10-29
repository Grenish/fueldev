"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Trash2 } from "lucide-react";
import { SavedSocial } from "../types";

interface SocialLinksProps {
  savedSocials: SavedSocial[];
  onAddClick: () => void;
  onRemove: (iconName: string) => void;
  onIconClick: (e: React.MouseEvent, social: SavedSocial) => void;
}

export function SocialLinks({
  savedSocials,
  onAddClick,
  onRemove,
  onIconClick,
}: SocialLinksProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Social Links
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={onAddClick}
                className="size-8"
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Social Link</TooltipContent>
          </Tooltip>
        </div>

        {savedSocials.length === 0 ? (
          <div className="flex items-center justify-center py-8 px-4 rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              No social links yet. Click the + button to add one.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {savedSocials.map((social) => (
              <Tooltip key={social.iconName}>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-11 relative hover:bg-accent"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => onIconClick(e, social)}
                      >
                        <social.icon className="size-5" />
                        {social.isNsfw && (
                          <span className="absolute -top-1 -right-1 size-3 bg-destructive rounded-full border-2 border-background" />
                        )}
                      </a>
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 size-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        onRemove(social.iconName);
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {social.customName || social.iconName}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
