"use client";

import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import { forwardRef, useImperativeHandle, useState } from "react";
import type { Editor, Range } from "@tiptap/core";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Minus,
  Code,
} from "lucide-react";

interface CommandItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  command?: (props: { editor: Editor; range: Range }) => void;
}

interface CommandListProps {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
}

interface CommandListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [prevItemsLength, setPrevItemsLength] = useState(items.length);

    // Reset selected index when items array changes
    if (items.length !== prevItemsLength) {
      setSelectedIndex(0);
      setPrevItemsLength(items.length);
    }

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }

        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="slash-command-menu bg-popover/95 backdrop-blur-xl rounded-lg shadow-lg border border-border overflow-hidden min-w-[220px] max-h-[280px]">
        <div className="p-1 overflow-y-auto max-h-[280px]">
          {items.length > 0 ? (
            items.map((item, index) => (
              <button
                key={index}
                onClick={() => selectItem(index)}
                className={`w-full text-left px-2 py-1.5 rounded transition-all duration-100 flex items-center gap-2 group ${
                  index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <div
                  className={`shrink-0 transition-colors ${
                    index === selectedIndex
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[13px] font-medium transition-colors ${
                      index === selectedIndex
                        ? "text-accent-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </div>
                </div>
                {index === selectedIndex && (
                  <div className="shrink-0 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    ⏎
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              No results
            </div>
          )}
        </div>
      </div>
    );
  },
);

CommandList.displayName = "CommandList";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: CommandItemProps;
        }) => {
          props.command?.({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const getSuggestionItems = ({ query }: { query: string }) => {
  const items = [
    {
      title: "Heading 1",
      description: "Large section heading",
      icon: <Heading1 className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading",
      icon: <Heading2 className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading",
      icon: <Heading3 className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list",
      icon: <List className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a numbered list",
      icon: <ListOrdered className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Insert a quote block",
      icon: <Quote className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: "Code Block",
      description: "Insert a code block",
      icon: <Code className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: "Divider",
      description: "Insert a horizontal divider",
      icon: <Minus className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: "Image",
      description: "Insert an image",
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).run();
        const url = window.prompt("Enter image URL:");
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    },
  ];

  return items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );
};

export const renderItems = () => {
  let component: ReactRenderer<CommandListRef> | null = null;
  let popup: HTMLElement | null = null;

  return {
    onStart: (props: SuggestionProps) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      const rect = props.clientRect();
      if (!rect) {
        return;
      }

      popup = document.createElement("div");
      popup.style.position = "absolute";
      popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.zIndex = "50";

      popup.appendChild(component.element);
      document.body.appendChild(popup);
    },

    onUpdate(props: SuggestionProps) {
      component?.updateProps(props);

      if (!props.clientRect || !popup) {
        return;
      }

      const rect = props.clientRect();
      if (!rect) {
        return;
      }

      popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === "Escape") {
        if (popup) {
          popup.remove();
          popup = null;
        }
        component?.destroy();
        return true;
      }

      return component?.ref?.onKeyDown(props) || false;
    },

    onExit() {
      if (popup) {
        popup.remove();
        popup = null;
      }
      component?.destroy();
    },
  };
};
