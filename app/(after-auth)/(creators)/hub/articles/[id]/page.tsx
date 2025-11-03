"use client";

import { useParams, useRouter } from "next/navigation";
import { ArticleEditor } from "@/components/editor/article-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Eye,
  Globe2,
  Heart,
  Lock,
  ThumbsUp,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const { data: article, isLoading } = trpc.article.getById.useQuery(
    { id: articleId },
    { enabled: !!articleId }
  );

  // Get visibility icon and label
  const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
      case "public":
        return { icon: Globe2, label: "Public", color: "bg-green-500" };
      case "private":
        return { icon: Lock, label: "Private", color: "bg-gray-500" };
      case "supporters":
        return { icon: Heart, label: "Supporters Only", color: "bg-pink-500" };
      case "members":
        return { icon: Users, label: "Members Only", color: "bg-blue-500" };
      default:
        return { icon: Globe2, label: "Public", color: "bg-green-500" };
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-12 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Article Not Found</h1>
          <p className="text-muted-foreground">
            The article you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/hub/posts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  const visibilityInfo = getVisibilityInfo(article.visibility);
  const VisibilityIcon = visibilityInfo.icon;

  return (
    <div className="h-full w-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/hub/posts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/hub/articles/${article.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Article
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-4xl space-y-6">
          {/* Article Metadata Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant={article.published ? "default" : "secondary"}
                  className="gap-1"
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
                <Badge variant="outline" className="gap-1">
                  <VisibilityIcon className="h-3 w-3" />
                  {visibilityInfo.label}
                </Badge>
              </div>
              <CardTitle className="text-3xl">
                {article.title || "Untitled"}
              </CardTitle>
              {article.excerpt && (
                <CardDescription className="text-base mt-2">
                  {article.excerpt}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                    {article.published && article.publishedAt
                      ? `Published ${formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}`
                      : `Updated ${formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}`}
                  </span>
                </div>
                {article.scheduledFor && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Scheduled for{" "}
                      {new Date(article.scheduledFor).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              {article.published && (
                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {article.likeCount || 0} Likes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {article.viewCount || 0} Views
                    </span>
                  </div>
                </div>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden border">
              <Image
                src={article.coverImage}
                alt={article.title || "Article cover"}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <Separator />

          {/* Article Content */}
          <div className="min-h-[400px]">
            <ArticleEditor
              initialContent={article.content}
              editable={false}
              folder="articles"
            />
          </div>

          {/* Footer Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  <p>Article ID: {article.id}</p>
                  <p>Slug: {article.slug}</p>
                </div>
                <div className="text-right">
                  <p>Created: {new Date(article.createdAt).toLocaleString()}</p>
                  <p>
                    Last updated: {new Date(article.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
