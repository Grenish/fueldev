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
import { FloatingMenu } from "./floating-menu";
import {
  SlashCommand,
  getSuggestionItems,
  renderItems,
  setImageDialogCallback,
} from "./slash-command";
import { ImageUploadDialog } from "./image-upload-dialog";
import { CustomImage } from "./image-extension";
import { useState, useEffect, useRef } from "react";
import "./editor-style.css";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  folder?: string;
  userId?: string;
}

export function TiptapEditor({
  content = "",
  onChange,
  editable = true,
  folder = "content",
  userId,
}: TiptapEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const contentRef = useRef(content);
  const onChangeRef = useRef(onChange);

  // Update refs when props change
  useEffect(() => {
    contentRef.current = content;
    onChangeRef.current = onChange;
  }, [content, onChange]);

  const editor = useEditor({
    immediatelyRender: false,
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
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-12rem)]",
      },
    },
    onUpdate: ({ editor }) => {
      // Use queueMicrotask to defer state update and avoid flushSync warning
      queueMicrotask(() => {
        const currentOnChange = onChangeRef.current;
        if (currentOnChange && editor && !editor.isDestroyed) {
          try {
            const html = editor.getHTML();
            console.log("Editor onUpdate called:", {
              htmlLength: html?.length || 0,
              htmlPreview: html?.substring(0, 100),
            });
            currentOnChange(html);
          } catch (error) {
            console.error("Error in editor onChange:", error);
          }
        } else {
          console.log("Editor onUpdate skipped:", {
            hasOnChange: !!currentOnChange,
            hasEditor: !!editor,
            isDestroyed: editor?.isDestroyed,
          });
        }
      });
    },
    onCreate: ({ editor }) => {
      console.log("Editor created:", {
        hasContent: !!editor.getHTML(),
        contentLength: editor.getHTML()?.length || 0,
      });
      // Defer state update to avoid flushSync warning
      queueMicrotask(() => {
        setIsInitialized(true);
      });
    },
    onDestroy: () => {
      // Defer state update to avoid flushSync warning
      queueMicrotask(() => {
        setIsInitialized(false);
      });
    },
  });

  // Update editor content when prop changes (but not on initial render)
  useEffect(() => {
    if (editor && !editor.isDestroyed && isInitialized) {
      const currentContent = editor.getHTML();
      if (content !== currentContent && content !== contentRef.current) {
        // Use requestAnimationFrame to defer content update
        requestAnimationFrame(() => {
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(content, { emitUpdate: false });
          }
        });
      }
    }
  }, [content, editor, isInitialized]);

  // Set up image dialog callback
  useEffect(() => {
    if (editor && !editor.isDestroyed && isInitialized) {
      setImageDialogCallback(() => {
        // Defer state update to avoid flushSync warning
        queueMicrotask(() => {
          setImageDialogOpen(true);
        });
      });
    }

    return () => {
      setImageDialogCallback(null);
    };
  }, [editor, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor || !isInitialized) {
    return (
      <div className="relative w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none min-h-[calc(100vh-12rem)] animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl">
        <EditorContent editor={editor} className="medium-editor" />
        {editable && editor && !editor.isDestroyed && (
          <FloatingMenu editor={editor} />
        )}
      </div>
      {editor && !editor.isDestroyed && (
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
