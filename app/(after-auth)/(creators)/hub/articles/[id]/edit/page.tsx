"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArticleEditor } from "@/components/editor/article-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/react";
import { useDebouncedCallback } from "use-debounce";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const utils = trpc.useUtils();

  const [content, setContent] = useState("");
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get user session
  const { data: session } = trpc.user.getSession.useQuery();

  // Fetch article
  const {
    data: article,
    isLoading,
    error,
  } = trpc.article.getById.useQuery(
    { id: articleId },
    {
      enabled: !!articleId,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Update mutation
  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      utils.article.list.invalidate();
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save changes");
      setIsSaving(false);
    },
  });

  // Extract title from HTML
  const extractTitle = (html: string): string => {
    const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (!match) return article?.title || "Untitled";
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

      await updateMutation.mutateAsync({
        id: articleId,
        title,
        content: newContent,
      });
    },
    2000,
    { leading: false, trailing: true }
  );

  // Handle content changes
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);

      // Only trigger auto-save after content is initially loaded
      if (isContentLoaded) {
        debouncedSave(newContent);
      }
    },
    [debouncedSave, isContentLoaded]
  );

  // Load article content once
  useEffect(() => {
    if (article && !isContentLoaded) {
      setContent(article.content);
      setIsContentLoaded(true);
    }
  }, [article, isContentLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Get save status
  const getSaveStatus = () => {
    if (updateMutation.isPending || isSaving) {
      return "saving";
    }
    return "saved";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">
            {error?.data?.code === "FORBIDDEN"
              ? "Access Denied"
              : "Article Not Found"}
          </h1>
          <p className="text-muted-foreground">
            {error?.data?.code === "FORBIDDEN"
              ? "You don't have permission to edit this article."
              : "The article you're trying to edit doesn't exist or has been deleted."}
          </p>
          <Button onClick={() => router.push("/hub/posts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/hub/posts")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/hub/articles/${articleId}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>

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
        {isContentLoaded && (
          <ArticleEditor
            key={articleId}
            initialContent={content}
            onChange={handleContentChange}
            folder="articles"
            userId={session?.user?.id}
          />
        )}
      </div>
    </div>
  );
}
