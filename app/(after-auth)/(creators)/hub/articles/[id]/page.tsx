"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/react";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Edit,
  Ellipsis,
  Eye,
  Globe2,
  Heart,
  Lock,
  MessageCircle,
  MessageSquare,
  Share2,
  ThumbsUp,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import "@/components/editor/editor-style.css";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

// Production-grade sanitization using DOMPurify
function sanitizeContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "u",
      "s",
      "mark",
      "a",
      "img",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "class"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  });
}

const ArticleContent = memo(({ content }: { content: string }) => {
  const sanitizedContent = useMemo(() => sanitizeContent(content), [content]);

  return (
    <div className="min-h-[400px]">
      <div className="relative w-full flex justify-center">
        <div className="w-full">
          <div
            className="ProseMirror"
            style={{ minHeight: "auto" }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </div>
  );
});

ArticleContent.displayName = "ArticleContent";

function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const [isLiked, setIsLiked] = useState(false);

  const { data: article, isLoading } = trpc.article.getById.useQuery(
    { id: articleId },
    {
      enabled: !!articleId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const visibilityInfo = useMemo(() => {
    if (!article)
      return { icon: Globe2, label: "Public", color: "text-green-600" };

    switch (article.visibility) {
      case "public":
        return { icon: Globe2, label: "Public", color: "text-green-600" };
      case "private":
        return { icon: Lock, label: "Private", color: "text-gray-600" };
      case "supporters":
        return {
          icon: Heart,
          label: "Supporters Only",
          color: "text-pink-600",
        };
      case "members":
        return { icon: Users, label: "Members Only", color: "text-blue-600" };
      default:
        return { icon: Globe2, label: "Public", color: "text-green-600" };
    }
  }, [article]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like mutation
  };

  const handleComment = () => {
    // TODO: Scroll to comments section or open comment dialog
    console.log("Open comments");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: article?.title || "Article",
        url: window.location.href,
      });
    }
  };

  if (isLoading && !article) {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-5xl mx-auto">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-full max-w-4xl space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-96 w-full" />
            <ContentSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
            </EmptyMedia>
            <EmptyTitle>Article Not Found</EmptyTitle>
            <EmptyDescription>
              The article you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => router.push("/hub/posts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </Empty>
      </div>
    );
  }

  const VisibilityIcon = visibilityInfo.icon;

  return (
    <div className="h-full w-full relative overflow-y-auto pb-20">
      {/* Article Content */}
      <article className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          {/* Status & Visibility Badges */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => router.push("/hub/posts")}
              >
                <ArrowLeft />
              </Button>
              <Badge
                variant="outline"
                className={cn("gap-1.5", visibilityInfo.color)}
              >
                <VisibilityIcon className="h-3 w-3" />
                {visibilityInfo.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={article.published ? "default" : "secondary"}
                className="gap-1.5"
              >
                {article.published ? (
                  <>
                    <Eye className="h-3 w-3" />
                    Published
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    Draft
                  </>
                )}
              </Badge>
              <Button
                size="icon-sm"
                className="rounded-full"
                onClick={() => router.push(`/hub/articles/${article.id}/edit`)}
              >
                <Edit className="size-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-times sm:text-5xl font-bold tracking-tight mb-4">
            {article.title || "Untitled"}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>
                {article.published && article.publishedAt
                  ? formatDistanceToNow(new Date(article.publishedAt), {
                      addSuffix: true,
                    })
                  : formatDistanceToNow(new Date(article.updatedAt), {
                      addSuffix: true,
                    })}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span>{Math.ceil(article.content.length / 1000)} min read</span>
            </div>

            {article.scheduledFor && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  Scheduled for{" "}
                  {new Date(article.scheduledFor).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>
            )}

            {article.published && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span>{article.viewCount || 0} views</span>
              </>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="mb-10" />

          {/* Article Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ArticleContent content={article.content} />
          </div>

          {/* Footer Metadata (minimal) */}
          <div className="mt-16 pt-8 border-t">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>
                Created {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>
                Last updated {new Date(article.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="relative w-full">
            <div className="w-1/2 rounded-full p-3 border mx-auto sticky top-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button size={"sm"} className="rounded-full" variant={"ghost"}>
                  <ThumbsUp /> 0
                </Button>
                <Button size={"sm"} className="rounded-full" variant={"ghost"}>
                  <MessageCircle /> 0
                </Button>
                <Button size={"sm"} className="rounded-full" variant={"ghost"}>
                  <Share2 /> 0
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button size={"sm"} className="rounded-full" variant={"ghost"}>
                  <Bookmark /> 0
                </Button>
                <Separator orientation="vertical" />
                <Button
                  size={"icon-sm"}
                  className="rounded-full"
                  variant={"ghost"}
                >
                  <Ellipsis />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
