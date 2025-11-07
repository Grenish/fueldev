"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { CustomImage } from "./image-extension";
import { ImageUploadDialog } from "./image-upload-dialog";
import {
  SlashCommand,
  getSuggestionItems,
  renderItems,
  setImageDialogCallback,
} from "./slash-command";
import { useEffect, useRef, useState, startTransition } from "react";
import "./editor-style.css";

const lowlight = createLowlight(common);

interface ArticleEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  folder?: string;
  userId?: string;
}

export function ArticleEditor({
  initialContent = "",
  onChange,
  editable = true,
  folder = "articles",
  userId,
}: ArticleEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const onChangeRef = useRef(onChange);
  const contentSetRef = useRef(false);

  // Update onChange ref
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Title";
          }
          return "Write your story…";
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-12rem)]",
      },
    },
    onUpdate: ({ editor }) => {
      // Defer to avoid flushSync warning
      queueMicrotask(() => {
        const currentOnChange = onChangeRef.current;
        if (currentOnChange && editor && !editor.isDestroyed) {
          try {
            const html = editor.getHTML();
            currentOnChange(html);
          } catch (error) {
            console.error("Error in editor onChange:", error);
          }
        }
      });
    },
    onCreate: ({ editor }) => {
      // Set initial content first, before marking as initialized
      if (initialContent && !contentSetRef.current) {
        editor.commands.setContent(initialContent, { emitUpdate: false });
        contentSetRef.current = true;
      }

      // Setup image dialog callback
      if (editable) {
        setImageDialogCallback(() => {
          queueMicrotask(() => {
            setImageDialogOpen(true);
          });
        });
      }

      // Mark as initialized using double RAF to completely avoid flushSync
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsInitialized(true);
          // Wait one more frame before rendering content
          requestAnimationFrame(() => {
            setIsContentReady(true);
          });
        });
      });
    },
    onDestroy: () => {
      startTransition(() => {
        setIsInitialized(false);
        setImageDialogCallback(null);
      });
    },
  });

  // Update content when initialContent changes (only if not already set)
  useEffect(() => {
    if (
      editor &&
      !editor.isDestroyed &&
      isInitialized &&
      initialContent &&
      !contentSetRef.current
    ) {
      requestAnimationFrame(() => {
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(initialContent, { emitUpdate: false });
          contentSetRef.current = true;
        }
      });
    }
  }, [editor, initialContent, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Ensure editor is fully ready before rendering
  if (!editor || !isInitialized || editor.isDestroyed) {
    return (
      <div className="relative w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none min-h-[calc(100vh-12rem)] animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl">
        {/* Defer EditorContent rendering to avoid flushSync */}
        {editor && isInitialized && isContentReady && !editor.isDestroyed && (
          <EditorContent editor={editor} className="medium-editor" />
        )}
      </div>

      {editable && editor && !editor.isDestroyed && (
        <ImageUploadDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          editor={editor}
          folder={folder}
          userId={userId}
        />
      )}
    </div>
  );
}
