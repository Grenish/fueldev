"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/react";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Eye,
  Globe2,
  Heart,
  Lock,
  MessageCircle,
  Share2,
  ThumbsUp,
  Trash2,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { memo, useMemo, useState, useEffect } from "react";
import DOMPurify from "dompurify";
import "@/components/editor/editor-style.css";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function sanitizeContent(html: string): string {
  const withoutFirstH1 = html.replace(/<h1[^>]*>.*?<\/h1>/i, "");

  return DOMPurify.sanitize(withoutFirstH1, {
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
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const utils = trpc.useUtils();

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

  // Engagement queries
  const { data: likeStatus } = trpc.articleEngagement.checkLikeStatus.useQuery(
    { articleId },
    { enabled: !!articleId },
  );

  const { data: engagementStats } =
    trpc.articleEngagement.getEngagementStats.useQuery(
      { articleId },
      { enabled: !!articleId },
    );

  const { data: commentsData } = trpc.articleEngagement.getComments.useQuery(
    { articleId, limit: 20 },
    { enabled: !!articleId && !!article?.published },
  );

  // Get replies for a specific comment
  const { data: repliesData } = trpc.articleEngagement.getReplies.useQuery(
    { commentId: replyingTo || "", limit: 20 },
    { enabled: !!replyingTo },
  );

  // Engagement mutations
  const toggleLikeMutation = trpc.articleEngagement.toggleLike.useMutation({
    onSuccess: () => {
      utils.articleEngagement.checkLikeStatus.invalidate({ articleId });
      utils.articleEngagement.getEngagementStats.invalidate({ articleId });
    },
  });

  const createCommentMutation =
    trpc.articleEngagement.createComment.useMutation({
      onSuccess: () => {
        setCommentText("");
        utils.articleEngagement.getComments.invalidate({ articleId });
        utils.articleEngagement.getEngagementStats.invalidate({ articleId });
      },
    });

  const deleteCommentMutation =
    trpc.articleEngagement.deleteComment.useMutation({
      onSuccess: () => {
        utils.articleEngagement.getComments.invalidate({ articleId });
        utils.articleEngagement.getEngagementStats.invalidate({ articleId });
      },
    });

  const createReplyMutation = trpc.articleEngagement.createReply.useMutation({
    onSuccess: () => {
      setReplyText("");
      setReplyingTo(null);
      utils.articleEngagement.getComments.invalidate({ articleId });
      utils.articleEngagement.getReplies.invalidate();
    },
  });

  const deleteReplyMutation = trpc.articleEngagement.deleteReply.useMutation({
    onSuccess: () => {
      utils.articleEngagement.getReplies.invalidate();
    },
  });

  const trackShareMutation = trpc.articleEngagement.trackShare.useMutation({
    onSuccess: () => {
      utils.articleEngagement.getEngagementStats.invalidate({ articleId });
    },
  });

  const trackViewMutation = trpc.articleEngagement.trackView.useMutation();

  // Track view on page load for published articles
  useEffect(() => {
    if (article?.published && articleId) {
      trackViewMutation.mutate({
        articleId,
        userAgent: navigator.userAgent,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.published, articleId]);

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
    toggleLikeMutation.mutate({ articleId });
  };

  const handleComment = () => {
    const commentsSection = document.getElementById("comments-section");
    commentsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || "Article",
          url: window.location.href,
        });
        trackShareMutation.mutate({ articleId, platform: "native" });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      trackShareMutation.mutate({ articleId, platform: "copy" });
    }
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      createCommentMutation.mutate({
        articleId,
        content: commentText.trim(),
      });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate({ commentId });
    }
  };

  const handlePostReply = (commentId: string) => {
    if (replyText.trim()) {
      createReplyMutation.mutate({
        commentId,
        content: replyText.trim(),
      });
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      deleteReplyMutation.mutate({ replyId });
    }
  };

  const handleCommentLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleReportComment = (commentId: string) => {
    alert("Report functionality would be implemented here");
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

            {article.published && engagementStats && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span>{engagementStats.viewCount || 0} views</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{engagementStats.likeCount || 0} likes</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{engagementStats.commentCount || 0} comments</span>
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

          {/* Footer Metadata */}
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

          {/* Engagement Actions */}
          {article.published && (
            <div className="flex items-center justify-between gap-4 py-6 border-y">
              <div className="flex items-center gap-2">
                <Button
                  variant={likeStatus?.liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={toggleLikeMutation.isPending}
                  className="gap-2"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      likeStatus?.liked && "fill-current",
                    )}
                  />
                  {engagementStats?.likeCount || 0}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleComment}
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {engagementStats?.commentCount || 0}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  disabled={trackShareMutation.isPending}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  {engagementStats?.shareCount || 0}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {engagementStats?.viewCount || 0} views
              </div>
            </div>
          )}

          {/* Comments Section */}
          {article.published && (
            <div
              id="comments-section"
              className="w-full rounded-xl border min-h-56 p-4 mt-8 flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-4">
                Comments ({engagementStats?.commentCount || 0})
              </h2>

              {/* Comment List */}
              {commentsData && commentsData.items.length > 0 ? (
                <div className="flex flex-col gap-4 w-full mb-6">
                  {commentsData.items.map((comment) => (
                    <div key={comment.id} className="w-full">
                      <div className="p-3 rounded-lg hover:bg-muted/50 border transition-colors">
                        {/* Comment Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={comment.user?.image || undefined}
                                alt={comment.user?.name || "User"}
                              />
                              <AvatarFallback>
                                {comment.user?.name
                                  ? comment.user.name
                                      .substring(0, 2)
                                      .toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="font-medium text-sm">
                                {comment.user?.name || "Anonymous User"}
                              </h2>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(comment.createdAt),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          {comment.userId === article.userId && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deleteCommentMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Comment Body */}
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {comment.content}
                        </p>

                        {/* Comment Actions */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              className="rounded-full text-xs"
                              variant={
                                likedComments.has(comment.id)
                                  ? "default"
                                  : "ghost"
                              }
                              onClick={() => handleCommentLike(comment.id)}
                            >
                              <ThumbsUp
                                className={cn(
                                  "w-3.5 h-3.5 mr-1",
                                  likedComments.has(comment.id) &&
                                    "fill-current",
                                )}
                              />
                              {likedComments.has(comment.id) ? "1" : "0"}
                            </Button>
                            <Button
                              size="sm"
                              className="rounded-full text-xs"
                              variant="ghost"
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === comment.id ? null : comment.id,
                                )
                              }
                            >
                              <MessageCircle className="w-3.5 h-3.5 mr-1" />
                              {comment._count.replies}
                            </Button>
                          </div>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-warning"
                            title="Report comment"
                            onClick={() => handleReportComment(comment.id)}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Reply Section */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 ml-10 border-l pl-4 space-y-3">
                            {/* Existing Replies */}
                            {repliesData &&
                              repliesData.items.length > 0 &&
                              repliesData.items.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="flex items-start gap-3"
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={reply.user?.image || undefined}
                                      alt={reply.user?.name || "User"}
                                    />
                                    <AvatarFallback>
                                      {reply.user?.name
                                        ? reply.user.name
                                            .substring(0, 2)
                                            .toUpperCase()
                                        : "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 rounded-lg border p-2 bg-muted/30">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-sm">
                                          {reply.user?.name || "Anonymous User"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(
                                            new Date(reply.createdAt),
                                            {
                                              addSuffix: true,
                                            },
                                          )}
                                        </p>
                                      </div>
                                      {reply.userId === article.userId && (
                                        <Button
                                          size="icon-sm"
                                          variant="ghost"
                                          className="text-muted-foreground hover:text-destructive"
                                          onClick={() =>
                                            handleDeleteReply(reply.id)
                                          }
                                          disabled={
                                            deleteReplyMutation.isPending
                                          }
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      )}
                                    </div>
                                    <p className="text-sm">{reply.content}</p>
                                  </div>
                                </div>
                              ))}

                            {/* Reply Input */}
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={article.user?.image || undefined}
                                  alt={article.user?.name || "User"}
                                />
                                <AvatarFallback>
                                  {article.user?.name
                                    ?.substring(0, 2)
                                    .toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <textarea
                                  placeholder="Write a reply..."
                                  className="w-full resize-none rounded-lg border bg-transparent p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                  rows={2}
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-full text-xs"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="rounded-full text-xs"
                                    onClick={() => handlePostReply(comment.id)}
                                    disabled={
                                      !replyText.trim() ||
                                      createReplyMutation.isPending
                                    }
                                  >
                                    {createReplyMutation.isPending
                                      ? "Posting..."
                                      : "Reply"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>Be the First to Comment</EmptyTitle>
                    <EmptyDescription>
                      This article doesn&apos;t have any comments yet. Start the
                      conversation below.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}

              {/* Comment Input */}
              <div className="mt-6 border-t pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={article.user?.image || undefined}
                      alt={article.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {article.user?.name?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      placeholder="Write a comment..."
                      className="w-full resize-none rounded-lg border bg-transparent p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={handlePostComment}
                        disabled={
                          !commentText.trim() || createCommentMutation.isPending
                        }
                      >
                        {createCommentMutation.isPending
                          ? "Posting..."
                          : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
