"use client";

import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
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
import { cn } from "@/lib/utils";

interface CommandItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  command?: (props: { editor: Editor; range: Range }) => void;
}

interface CommandListProps {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
}

interface CommandListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
  element: HTMLDivElement | null;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
  ({ items, command, editor }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset selected index when items array changes
    useEffect(() => {
      setSelectedIndex(0);
    }, [items.length]);

    // Scroll selected item into view
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const selectedElement = container.querySelector(
        `[data-index="${selectedIndex}"]`,
      ) as HTMLElement;

      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, [selectedIndex]);

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
      element: containerRef.current,
    }));

    return (
      <div
        ref={containerRef}
        className={cn(
          "slash-command-menu",
          "bg-popover/95 backdrop-blur-xl",
          "rounded-lg shadow-lg border border-border",
          "overflow-hidden",
          "min-w-[220px] max-w-[320px]",
          "max-h-[280px]",
          "animate-in fade-in-0 zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
        )}
      >
        <div className="p-1 overflow-y-auto max-h-[280px]">
          {items.length > 0 ? (
            items.map((item, index) => (
              <button
                key={index}
                data-index={index}
                onClick={() => selectItem(index)}
                className={cn(
                  "w-full text-left",
                  "px-2 py-1.5 rounded",
                  "transition-all duration-100",
                  "flex items-center gap-2",
                  "group",
                  index === selectedIndex ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <div
                  className={cn(
                    "shrink-0 transition-colors",
                    index === selectedIndex
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-[13px] font-medium transition-colors",
                      index === selectedIndex
                        ? "text-accent-foreground"
                        : "text-foreground",
                    )}
                  >
                    {item.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.description}
                  </div>
                </div>
                {index === selectedIndex && (
                  <div
                    className={cn(
                      "shrink-0",
                      "text-[10px] font-medium",
                      "text-muted-foreground",
                      "bg-muted px-1.5 py-0.5 rounded",
                    )}
                  >
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

// Calculate optimal position for the menu
function calculateMenuPosition(
  rect: DOMRect,
  menuHeight: number = 280,
  menuWidth: number = 320,
) {
  const padding = 8;
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollY: window.scrollY,
    scrollX: window.scrollX,
  };

  // Calculate available space
  const spaceAbove = rect.top;
  const spaceBelow = viewport.height - rect.bottom;
  const spaceLeft = rect.left;
  const spaceRight = viewport.width - rect.right;

  // Determine vertical position
  let top: number;
  let side: "top" | "bottom";

  if (spaceBelow >= menuHeight + padding || spaceBelow > spaceAbove) {
    // Place below
    top = rect.bottom + viewport.scrollY + padding;
    side = "bottom";
  } else {
    // Place above
    top = rect.top + viewport.scrollY - menuHeight - padding;
    side = "top";
  }

  // Determine horizontal position
  let left = rect.left + viewport.scrollX;

  // Adjust if menu would overflow right edge
  if (left + menuWidth > viewport.width - padding) {
    left = Math.max(
      padding,
      viewport.width - menuWidth - padding + viewport.scrollX,
    );
  }

  // Adjust if menu would overflow left edge
  if (left < padding) {
    left = padding + viewport.scrollX;
  }

  // Ensure menu stays within viewport vertically
  if (
    side === "bottom" &&
    top + menuHeight > viewport.height + viewport.scrollY - padding
  ) {
    top = viewport.height + viewport.scrollY - menuHeight - padding;
  } else if (side === "top" && top < viewport.scrollY + padding) {
    top = viewport.scrollY + padding;
  }

  return { top, left, side };
}

// Global state for image dialog
let globalImageDialogCallback: (() => void) | null = null;

export function setImageDialogCallback(callback: (() => void) | null) {
  globalImageDialogCallback = callback;
}

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
        if (globalImageDialogCallback) {
          globalImageDialogCallback();
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
  let resizeObserver: ResizeObserver | null = null;

  const updatePosition = (clientRect: () => DOMRect | null) => {
    if (!popup || !component?.ref?.element) return;

    const rect = clientRect();
    if (!rect) return;

    // Get actual menu dimensions
    const menuRect = component.ref.element.getBoundingClientRect();
    const position = calculateMenuPosition(
      rect,
      menuRect.height || 280,
      menuRect.width || 320,
    );

    popup.style.top = `${position.top}px`;
    popup.style.left = `${position.left}px`;
    popup.setAttribute("data-side", position.side);

    // Update animation direction on the menu
    if (component.ref.element) {
      component.ref.element.setAttribute("data-side", position.side);
    }
  };

  return {
    onStart: (props: SuggestionProps) => {
      component = new ReactRenderer(CommandList, {
        props: { ...props, editor: props.editor },
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      popup = document.createElement("div");
      popup.className = cn(
        "slash-command-popup",
        "fixed",
        "z-50",
        "pointer-events-auto",
      );

      popup.appendChild(component.element);
      document.body.appendChild(popup);

      // Initial position
      updatePosition(props.clientRect);

      // Watch for viewport changes
      const handleResize = () => updatePosition(props.clientRect!);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize, true);

      // Watch for menu size changes
      if (component.ref?.element) {
        resizeObserver = new ResizeObserver(() => {
          updatePosition(props.clientRect!);
        });
        resizeObserver.observe(component.ref.element);
      }

      // Store cleanup function
      (popup as any).cleanup = () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize, true);
        resizeObserver?.disconnect();
      };
    },

    onUpdate(props: SuggestionProps) {
      component?.updateProps({ ...props, editor: props.editor });

      if (!props.clientRect || !popup) {
        return;
      }

      updatePosition(props.clientRect);
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === "Escape") {
        if (popup) {
          (popup as any).cleanup?.();
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
        (popup as any).cleanup?.();
        popup.remove();
        popup = null;
      }
      resizeObserver?.disconnect();
      component?.destroy();
    },
  };
};
