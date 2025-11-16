import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import * as React from "react";

/* Root Container */
const CommentBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full space-y-3 text-sm", className)}
    {...props}
  />
));
CommentBox.displayName = "CommentBox";

/* Thread Container - For nested comments */
interface CommentBoxThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: number;
  showLine?: boolean;
}

const CommentBoxThread = React.forwardRef<
  HTMLDivElement,
  CommentBoxThreadProps
>(({ className, level = 0, showLine = true, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        // indent nested threads
        level > 0 && "ml-4",
        // draw connector only for nested levels
        level > 0 &&
          showLine && [
            // space on the left reserved for the line + connector
            "pl-6",
            // vertical line
            "before:absolute before:left-2 before:top-0 before:bottom-0",
            "before:w-px before:bg-border/60 before:content-['']",
            // horizontal connector (aligned with avatar center of first reply)
            "after:absolute after:left-2 after:top-6",
            "after:h-px after:w-5 after:bg-border/60 after:content-['']",
            // purely visual; no interaction
            "before:pointer-events-none after:pointer-events-none",
          ],
        className,
      )}
      data-level={level}
      {...props}
    >
      {children}
    </div>
  );
});
CommentBoxThread.displayName = "CommentBoxThread";

/* Comment Item - Individual comment wrapper */
interface CommentBoxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isReply?: boolean;
}

const CommentBoxItem = React.forwardRef<HTMLDivElement, CommentBoxItemProps>(
  ({ className, isReply, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative flex gap-3 rounded-md px-2",
        !isReply && "py-2",
        isReply && "py-1.5",
        "transition-colors hover:bg-muted/60",
        className,
      )}
      {...props}
    />
  ),
);
CommentBoxItem.displayName = "CommentBoxItem";

/* Avatar Wrapper */
const CommentBoxAvatar = React.forwardRef<
  React.ComponentRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar>
>(({ className, ...props }, ref) => (
  <Avatar
    ref={ref}
    className={cn("h-8 w-8 shrink-0 mt-0.5", className)}
    {...props}
  />
));
CommentBoxAvatar.displayName = "CommentBoxAvatar";

/* Avatar Image */
const CommentBoxAvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarImage>,
  React.ComponentPropsWithoutRef<typeof AvatarImage>
>((props, ref) => <AvatarImage ref={ref} {...props} />);
CommentBoxAvatarImage.displayName = "CommentBoxAvatarImage";

/* Avatar Fallback */
const CommentBoxAvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarFallback>,
  React.ComponentPropsWithoutRef<typeof AvatarFallback>
>((props, ref) => <AvatarFallback ref={ref} {...props} />);
CommentBoxAvatarFallback.displayName = "CommentBoxAvatarFallback";

/* Body Container */
const CommentBoxBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 min-w-0 space-y-1.5", className)}
    {...props}
  />
));
CommentBoxBody.displayName = "CommentBoxBody";

/* Header */
const CommentBoxHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5", className)}
    {...props}
  />
));
CommentBoxHeader.displayName = "CommentBoxHeader";

/* Author Name */
const CommentBoxAuthor = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-[13px] font-semibold text-foreground", className)}
    {...props}
  />
));
CommentBoxAuthor.displayName = "CommentBoxAuthor";

/* Badge */
interface CommentBoxBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

const CommentBoxBadge = React.forwardRef<HTMLSpanElement, CommentBoxBadgeProps>(
  ({ className, variant = "secondary", ...props }, ref) => {
    const variants = {
      default: "bg-primary/10 text-primary border-primary/20",
      secondary: "bg-muted text-muted-foreground border-muted",
      outline: "bg-background text-muted-foreground border-border/60",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-1.5 py-0.5",
          "text-[10px] font-medium uppercase tracking-wider",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
CommentBoxBadge.displayName = "CommentBoxBadge";

/* Timestamp */
const CommentBoxTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    className={cn("text-[11px] text-muted-foreground", className)}
    {...props}
  />
));
CommentBoxTime.displayName = "CommentBoxTime";

/* Comment Text */
const CommentBoxText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[13px] leading-relaxed text-foreground wrap-break-word",
      className,
    )}
    {...props}
  />
));
CommentBoxText.displayName = "CommentBoxText";

/* Mention - Just a styled span for manual use */
const CommentBoxMention = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "font-medium text-primary hover:underline cursor-pointer",
      className,
    )}
    {...props}
  />
));
CommentBoxMention.displayName = "CommentBoxMention";

/* Utility function to parse text with mentions */
export function parseTextWithMentions(text: string): React.ReactNode[] {
  const mentionRegex = /@(\w+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <CommentBoxMention key={match.index}>@{match[1]}</CommentBoxMention>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/* Text with auto-parsed mentions */
interface CommentBoxTextWithMentionsProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

const CommentBoxTextWithMentions = React.forwardRef<
  HTMLParagraphElement,
  CommentBoxTextWithMentionsProps
>(({ className, text, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[13px] leading-relaxed text-foreground wrap-break-word",
      className,
    )}
    {...props}
  >
    {parseTextWithMentions(text)}
  </p>
));
CommentBoxTextWithMentions.displayName = "CommentBoxTextWithMentions";

/* Actions Container */
const CommentBoxActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-1 flex items-center gap-1.5 -ml-1 text-[11px]",
      className,
    )}
    {...props}
  />
));
CommentBoxActions.displayName = "CommentBoxActions";

/* Action Button - Using shadcn Button */
interface CommentBoxActionProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  active?: boolean;
}

const CommentBoxAction = React.forwardRef<
  React.ComponentRef<typeof Button>,
  CommentBoxActionProps
>(({ className, active, variant = "ghost", size = "sm", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn(
      "h-7 px-2 text-[11px] font-normal text-muted-foreground rounded-full",
      "hover:text-foreground hover:bg-muted/70",
      active && [
        "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary",
        "ring-1 ring-primary/10",
      ],
      className,
    )}
    {...props}
  />
));
CommentBoxAction.displayName = "CommentBoxAction";

/* Input Area */
interface CommentBoxInputProps
  extends React.ComponentPropsWithoutRef<typeof Textarea> {
  onSubmit?: () => void;
  submitText?: string;
  submitButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  cancelText?: string;
  cancelButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  onCancel?: () => void;
  showActions?: boolean;
}

const CommentBoxInput = React.forwardRef<
  React.ComponentRef<typeof Textarea>,
  CommentBoxInputProps
>(
  (
    {
      className,
      onSubmit,
      submitText = "Comment",
      submitButtonProps,
      cancelText = "Cancel",
      cancelButtonProps,
      onCancel,
      showActions = true,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(
          typeof value === "string" ? value.trim().length > 0 : !!value,
        );
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setHasValue(newValue.trim().length > 0);
      onChange?.(e);
    };

    const { className: submitClassName, ...restSubmitProps } =
      submitButtonProps ?? {};
    const { className: cancelClassName, ...restCancelProps } =
      cancelButtonProps ?? {};

    return (
      <div className="w-full space-y-2">
        <Textarea
          ref={ref}
          value={value}
          className={cn(
            "min-h-[72px] resize-none text-sm",
            "rounded-md bg-muted/40 border-muted",
            "placeholder:text-muted-foreground/60",
            "focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40",
            className,
          )}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.target.value) setFocused(false);
          }}
          onChange={handleChange}
          {...props}
        />
        {showActions && (focused || hasValue) && (
          <div className="flex justify-end gap-2 pt-1">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("h-8 px-3 text-xs", cancelClassName)}
                onClick={onCancel}
                {...restCancelProps}
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              className={cn("h-8 px-3 text-xs font-medium", submitClassName)}
              onClick={onSubmit}
              disabled={!hasValue}
              {...restSubmitProps}
            >
              {submitText}
            </Button>
          </div>
        )}
      </div>
    );
  },
);
CommentBoxInput.displayName = "CommentBoxInput";

/* Simple Input - for inline reply */
const CommentBoxSimpleInput = React.forwardRef<
  React.ComponentRef<typeof Textarea>,
  React.ComponentPropsWithoutRef<typeof Textarea>
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    className={cn("min-h-4 resize-none py-2 text-[13px]", className)}
    rows={1}
    {...props}
  />
));
CommentBoxSimpleInput.displayName = "CommentBoxSimpleInput";

/* Replies Container */
const CommentBoxReplies = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
));
CommentBoxReplies.displayName = "CommentBoxReplies";

/* Divider */
const CommentBoxDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("my-4 border-t border-border/60", className)}
    {...props}
  />
));
CommentBoxDivider.displayName = "CommentBoxDivider";

export {
  CommentBox,
  CommentBoxThread,
  CommentBoxItem,
  CommentBoxAvatar,
  CommentBoxAvatarImage,
  CommentBoxAvatarFallback,
  CommentBoxBody,
  CommentBoxHeader,
  CommentBoxAuthor,
  CommentBoxBadge,
  CommentBoxTime,
  CommentBoxText,
  CommentBoxTextWithMentions,
  CommentBoxMention,
  CommentBoxActions,
  CommentBoxAction,
  CommentBoxInput,
  CommentBoxSimpleInput,
  CommentBoxReplies,
  CommentBoxDivider,
};
