"use client";

import TiptapImage from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function ImageNodeView({ node, updateAttributes }: NodeViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const altText = (node.attrs.alt as string) || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateAttributes({ alt: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <NodeViewWrapper className="my-8">
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.attrs.src as string}
          alt={altText}
          className="rounded-lg shadow-md max-w-full h-auto"
        />
        <div className="w-full max-w-2xl px-4 -mt-10">
          <input
            ref={inputRef}
            type="text"
            value={altText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Add image description"
            className={cn(
              "w-full text-center text-sm bg-transparent border-0 transition-all outline-none px-2 pt-0 pb-1",
              "placeholder:text-muted-foreground/40 placeholder:font-light",
              "text-muted-foreground/80 font-light",
            )}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const CustomImage = TiptapImage.extend({
  addAttributes() {
    const parentAttributes = this.parent ? this.parent() : {};
    return {
      ...parentAttributes,
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          return {
            alt: attributes.alt,
          };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
