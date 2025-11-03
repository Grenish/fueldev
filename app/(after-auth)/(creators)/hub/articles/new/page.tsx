"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArticleEditor } from "@/components/editor/article-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/react";
import { useDebouncedCallback } from "use-debounce";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewArticlePage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [content, setContent] = useState("");
  const [articleId, setArticleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get user session
  const { data: session } = trpc.user.getSession.useQuery();

  // Create article mutation
  const createMutation = trpc.article.create.useMutation({
    onSuccess: (data) => {
      setArticleId(data.id);
      utils.article.list.invalidate();
      // Redirect to edit page after creation
      router.push(`/hub/articles/${data.id}/edit`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create article");
      setIsSaving(false);
    },
  });

  // Update mutation
  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      utils.article.list.invalidate();
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save");
      setIsSaving(false);
    },
  });

  // Extract title from HTML
  const extractTitle = (html: string): string => {
    const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (!match) return "Untitled";
    const title = match[1].replace(/<[^>]*>/g, "").trim();
    return title || "Untitled";
  };

  // Check if content is empty
  const isContentEmpty = (html: string): boolean => {
    if (!html) return true;
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  };

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(
    async (newContent: string) => {
      if (isContentEmpty(newContent)) return;

      setIsSaving(true);
      const title = extractTitle(newContent);

      if (articleId) {
        await updateMutation.mutateAsync({
          id: articleId,
          title,
          content: newContent,
        });
      } else {
        await createMutation.mutateAsync({
          title,
          content: newContent,
        });
      }
    },
    2000,
    { leading: false, trailing: true }
  );

  // Handle content changes
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      debouncedSave(newContent);
    },
    [debouncedSave]
  );

  const getSaveStatus = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return "saving";
    }
    if (isSaving) {
      return "saving";
    }
    return "saved";
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/hub/posts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Badge
            variant={getSaveStatus() === "saving" ? "secondary" : "default"}
            className="gap-1.5"
          >
            {getSaveStatus() === "saving" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Saved</span>
            )}
          </Badge>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <ArticleEditor
          initialContent={content}
          onChange={handleContentChange}
          folder="articles"
          userId={session?.user?.id}
        />
      </div>
    </div>
  );
}
