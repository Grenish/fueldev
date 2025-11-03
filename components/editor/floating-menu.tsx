"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Heading2,
  Quote,
  Code,
} from "lucide-react";

interface FloatingMenuProps {
  editor: Editor;
}

export function FloatingMenu({ editor }: FloatingMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;

      if (!hasSelection) {
        // Defer state update to avoid flushSync warning
        queueMicrotask(() => {
          setIsVisible(false);
        });
        return;
      }

      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const menuWidth = 280;
      const menuHeight = 48;

      const left = (start.left + end.left) / 2 - menuWidth / 2;
      const top = start.top - menuHeight - 10;

      // Defer state updates to avoid flushSync warning
      queueMicrotask(() => {
        setPosition({ top, left });
        setIsVisible(true);
      });
    };

    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
    };
  }, [editor]);

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex items-center gap-1 bg-popover/95 backdrop-blur-sm text-popover-foreground rounded-lg shadow-2xl px-2 py-1.5 border border-border">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive("bold") ? "bg-accent" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive("italic") ? "bg-accent" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
          }`}
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive("link") ? "bg-accent" : ""
          }`}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive("blockquote") ? "bg-accent" : ""
          }`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive("code") ? "bg-accent" : ""
          }`}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
