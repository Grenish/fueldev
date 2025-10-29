"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { AnyBlock, SavedSocial } from "../types";
import { isYouTube, youTubeEmbedUrl, isSpotify } from "../constants";

interface PreviewPaneProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl?: string;
  savedSocials: SavedSocial[];
  blocks: AnyBlock[];
  onSocialClick: (e: React.MouseEvent, social: SavedSocial) => void;
}

export function PreviewPane({
  name,
  handle,
  bio,
  avatarUrl,
  savedSocials,
  blocks,
  onSocialClick,
}: PreviewPaneProps) {
  const renderBlock = (block: AnyBlock) => {
    switch (block.type) {
      case "heading": {
        const HeadingTag = `h${block.level}` as "h1" | "h2" | "h3";
        const sizeClasses = {
          1: "text-3xl font-bold",
          2: "text-2xl font-semibold",
          3: "text-xl font-semibold",
        };
        return (
          <HeadingTag
            className={`${sizeClasses[block.level]} text-foreground`}
            style={{ textAlign: block.align || "left" }}
          >
            {block.text}
          </HeadingTag>
        );
      }

      case "paragraph":
        return (
          <p
            className="text-sm leading-relaxed text-foreground"
            style={{ textAlign: block.align || "left" }}
          >
            {block.text}
          </p>
        );

      case "link":
        return (
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{block.title}</h4>
                  {block.isNsfw && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertTriangle className="size-3" />
                      18+
                    </span>
                  )}
                </div>
                {block.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {block.description}
                  </p>
                )}
              </div>
              <ExternalLink className="size-4 text-muted-foreground shrink-0" />
            </div>
          </a>
        );

      case "button":
        return (
          <Button asChild className="w-full">
            <a href={block.url} target="_blank" rel="noopener noreferrer">
              {block.label}
              <ExternalLink className="size-4 ml-2" />
            </a>
          </Button>
        );

      case "image":
        return (
          <div className="space-y-2">
            {block.linkUrl ? (
              <a
                href={block.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border hover:border-foreground/20 transition-all"
              >
                <img
                  src={block.src}
                  alt={block.alt || ""}
                  className="w-full h-auto object-cover"
                />
              </a>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={block.src}
                  alt={block.alt || ""}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            {block.caption && (
              <p className="text-xs text-muted-foreground text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        );

      case "embed":
        if (isYouTube(block.url)) {
          const embedUrl = youTubeEmbedUrl(block.url);
          if (embedUrl) {
            return (
              <div className="space-y-2">
                {block.title && (
                  <h4 className="font-semibold text-sm">{block.title}</h4>
                )}
                <div className="relative overflow-hidden rounded-lg border aspect-video bg-muted">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={block.title || "Video"}
                  />
                </div>
              </div>
            );
          }
        }
        return (
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {block.title || "External content"}
              </span>
            </div>
          </a>
        );

      case "spotify":
        if (block.useEmbed && isSpotify(block.url)) {
          const trackId = block.url.match(/track\/([a-zA-Z0-9]+)/)?.[1];
          if (trackId) {
            return (
              <div className="rounded-lg overflow-hidden border">
                <iframe
                  src={`https://open.spotify.com/embed/track/${trackId}`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="encrypted-media"
                  title={block.title}
                />
              </div>
            );
          }
        }
        return (
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all group"
          >
            {block.coverUrl && (
              <img
                src={block.coverUrl}
                alt={block.title}
                className="size-16 rounded object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">
                {block.title}
              </h4>
              {block.artist && (
                <p className="text-sm text-muted-foreground truncate">
                  {block.artist}
                </p>
              )}
            </div>
            <ExternalLink className="size-5 text-muted-foreground shrink-0" />
          </a>
        );

      case "list":
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag
            className={`space-y-2 ${block.ordered ? "list-decimal" : "list-disc"} list-inside text-sm text-foreground`}
          >
            {block.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case "spacer":
        return <div style={{ height: `${block.height}px` }} />;

      case "projects":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{block.title}</h3>
            <div className="grid gap-4">
              {block.items.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border bg-card p-5 hover:border-foreground/20 hover:shadow-sm transition-all"
                >
                  {project.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-lg mb-2">
                    {project.title}
                  </h4>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex px-2 py-1 rounded text-xs font-medium bg-muted text-foreground border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.demoUrl || project.repoUrl) && (
                    <div className="flex gap-2">
                      {project.demoUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="size-3.5 mr-1.5" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sticky top-8 h-fit">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground">
              Live Preview
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground font-medium">
                LIVE
              </span>
            </div>
          </div>

          {/* Preview content */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {/* Profile section */}
            <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b">
              <Avatar className="size-20 border-2 border-border">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-lg font-semibold">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold mb-1">{name}</h1>
                <p className="text-sm text-muted-foreground">{handle}</p>
              </div>

              <p className="text-sm leading-relaxed text-foreground max-w-md">
                {bio}
              </p>

              {savedSocials.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {savedSocials.map((social) => (
                      <Button
                        key={social.iconName}
                        size="icon"
                        variant="outline"
                        className="size-10 relative"
                        asChild
                      >
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => onSocialClick(e, social)}
                        >
                          <social.icon className="size-4.5" />
                          {social.isNsfw && (
                            <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-destructive rounded-full border-2 border-background" />
                          )}
                        </a>
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Blocks */}
            {blocks.length > 0 ? (
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div key={block.id}>{renderBlock(block)}</div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 px-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                    <ExternalLink className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No content blocks yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add blocks to see them here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
