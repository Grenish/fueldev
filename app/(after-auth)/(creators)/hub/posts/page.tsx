"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  ChartArea,
  ChartColumnBig,
  Clock,
  Ellipsis,
  FileEdit,
  Globe2,
  Lock,
  Newspaper,
  Plus,
  Search,
  ThumbsUp,
  Users,
  Heart,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreatorPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  // Fetch all articles
  const { data: allArticlesData, isLoading } = trpc.article.list.useQuery({
    limit: 50,
  });

  // Delete mutation
  const deleteMutation = trpc.article.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully");
      utils.article.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete article");
    },
  });

  // Publish mutation
  const publishMutation = trpc.article.publish.useMutation({
    onSuccess: () => {
      toast.success("Article published successfully");
      utils.article.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish article");
    },
  });

  // Unpublish mutation
  const unpublishMutation = trpc.article.unpublish.useMutation({
    onSuccess: () => {
      toast.success("Article unpublished successfully");
      utils.article.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unpublish article");
    },
  });

  // Update visibility mutation
  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      toast.success("Visibility updated successfully");
      utils.article.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update visibility");
    },
  });

  const articles = allArticlesData?.items || [];

  // Filter articles by status
  const publishedArticles = articles.filter(
    (article) => article.published && !article.scheduledFor,
  );
  const draftArticles = articles.filter((article) => !article.published);
  const scheduledArticles = articles.filter(
    (article) =>
      article.scheduledFor && new Date(article.scheduledFor) > new Date(),
  );

  // Extract excerpt from HTML content
  const getExcerpt = (content: string, maxLength = 200) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Get visibility icon and label
  const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
      case "public":
        return { icon: Globe2, label: "Public" };
      case "private":
        return { icon: Lock, label: "Private" };
      case "supporters":
        return { icon: Heart, label: "Supporters Only" };
      case "members":
        return { icon: Users, label: "Members Only" };
      default:
        return { icon: Globe2, label: "Public" };
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate({ id });
    }
  };

  // Handle publish
  const handlePublish = (id: string) => {
    publishMutation.mutate({
      id,
      visibility: "public",
      notifyFollowers: false,
      tags: [],
    });
  };

  // Handle unpublish
  const handleUnpublish = (id: string) => {
    unpublishMutation.mutate({ id });
  };

  // Handle visibility change
  const handleVisibilityChange = (id: string, visibility: string) => {
    updateMutation.mutate({
      id,
      visibility: visibility as "public" | "private" | "supporters" | "members",
    });
  };

  // Article Card Component
  const ArticleCard = ({ article, type }: { article: any; type: string }) => {
    const VisibilityIcon = getVisibilityInfo(article.visibility).icon;
    const visibilityLabel = getVisibilityInfo(article.visibility).label;

    return (
      <Card
        className="p-2 gap-0 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push(`/hub/articles/${article.id}`)}
      >
        <CardHeader className="p-2 m-0">
          <CardDescription className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              <Clock size={15} />
              {type === "published" &&
                `Posted ${formatDate(article.publishedAt || article.createdAt)}`}
              {type === "draft" && `Drafted ${formatDate(article.updatedAt)}`}
              {type === "scheduled" &&
                `Scheduled for ${new Date(article.scheduledFor).toLocaleDateString()}`}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <Ellipsis size={20} className="text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push(`/hub/articles/${article.id}`)}
                  >
                    View Article
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/hub/articles/${article.id}/edit`)
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                  {type === "draft" && (
                    <DropdownMenuItem onClick={() => handlePublish(article.id)}>
                      Publish
                    </DropdownMenuItem>
                  )}
                  {type === "published" && (
                    <>
                      <DropdownMenuItem>Pin this post</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Change visibility
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleVisibilityChange(article.id, "public")
                              }
                            >
                              Public
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleVisibilityChange(article.id, "private")
                              }
                            >
                              Private
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleVisibilityChange(article.id, "supporters")
                              }
                            >
                              Supporters Only
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleVisibilityChange(article.id, "members")
                              }
                            >
                              Members Only
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {type === "published" && (
                    <DropdownMenuItem
                      onClick={() => handleUnpublish(article.id)}
                    >
                      Unpublish
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleDelete(article.id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardDescription>
        </CardHeader>
        {article.coverImage && (
          <CardContent className="p-2">
            <div className="relative bg-muted w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title || "Article cover"}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        )}
        <CardHeader className="p-2">
          <CardTitle>{article.title || "Untitled"}</CardTitle>
          <CardDescription>
            {article.excerpt || getExcerpt(article.content)}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-2 flex items-center justify-between text-xs">
          <div className="gap-2 flex items-center text-muted-foreground">
            <VisibilityIcon size={15} />{" "}
            {type === "draft"
              ? "Draft"
              : type === "scheduled"
                ? "Scheduled"
                : visibilityLabel}
          </div>
          {type === "published" && (
            <div className="gap-6 flex items-center text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ThumbsUp size={15} />
                {article.likeCount || 0}
              </div>
              <div className="flex items-center gap-1.5">
                <ChartArea size={15} />
                {article.viewCount || 0}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full max-w-2xl p-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full rounded-full">
              <Plus /> Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="outline-none">
            <DialogHeader>
              <DialogTitle>Create Something</DialogTitle>
              <DialogDescription>
                Create new content for your supporters
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex items-center gap-2">
              <Link className="w-1/2" href={"/hub/articles/new"}>
                <div className="flex flex-1 flex-col items-center justify-center w-full border p-2 py-6 rounded-lg hover:bg-muted gap-2 cursor-pointer">
                  <Newspaper />
                  Article
                </div>
              </Link>
              <Link className="w-1/2" href={"posts/new/polls"}>
                <div className="flex flex-1 flex-col items-center justify-center w-full border p-2 py-6 rounded-lg hover:bg-muted gap-2 cursor-pointer">
                  <ChartColumnBig />
                  Poll
                </div>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-2 w-full max-w-2xl">
        <Tabs defaultValue="published">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="published">
                Published ({publishedArticles.length})
              </TabsTrigger>
              <TabsTrigger value="draft">
                Draft ({draftArticles.length})
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled ({scheduledArticles.length})
              </TabsTrigger>
            </TabsList>
            <Search size={15} />
          </div>
          <TabsContent value="published">
            {publishedArticles.length > 0 ? (
              <div className="space-y-4">
                {publishedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    type="published"
                  />
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={"icon"}>
                    <Newspaper />
                  </EmptyMedia>
                  <EmptyTitle className="capitalize">
                    No posts published yet
                  </EmptyTitle>
                  <EmptyDescription>
                    Your published posts will appear here once you share them
                    with your supporters.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
          <TabsContent value="draft">
            {draftArticles.length > 0 ? (
              <div className="space-y-4">
                {draftArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    type="draft"
                  />
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={"icon"}>
                    <FileEdit />
                  </EmptyMedia>
                  <EmptyTitle className="capitalize">
                    No drafts saved yet
                  </EmptyTitle>
                  <EmptyDescription>
                    Start writing something - your unfinished posts will be
                    saved here automatically.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
          <TabsContent value="scheduled">
            {scheduledArticles.length > 0 ? (
              <div className="space-y-4">
                {scheduledArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    type="scheduled"
                  />
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={"icon"}>
                    <CalendarClock />
                  </EmptyMedia>
                  <EmptyTitle className="capitalize">
                    No scheduled posts
                  </EmptyTitle>
                  <EmptyDescription>
                    Plan ahead by scheduling a post to go live at a specific
                    time - they'll show up here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
