"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/protected/dynamic-breadcrumb";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  Globe,
  Heart,
  Lock,
  Send,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../animate-ui/components/radix/checkbox";
import { Input } from "../ui/input";
import { trpc } from "@/lib/trpc/react";
import { toast } from "sonner";

interface LayoutHeaderProps {
  userName: string;
}

export function LayoutHeader({ userName }: LayoutHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isArticleRoute = pathname === "/hub/posts/new/article";

  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState<
    "public" | "private" | "supporters" | "members"
  >("public");
  const [notifyFollowers, setNotifyFollowers] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const articleId = searchParams.get("id");

  // Fetch article data if on article route
  const { data: articleData } = trpc.article.getById.useQuery(
    { id: articleId! },
    { enabled: !!articleId && isArticleRoute },
  );

  // Publish mutation
  const publishMutation = trpc.article.publish.useMutation({
    onSuccess: () => {
      toast.success("Article published!", {
        description: "Your article has been published successfully.",
      });
      setOpen(false);
      setIsPublishing(false);
      router.push("/hub/posts");
    },
    onError: (error) => {
      toast.error("Failed to publish", {
        description: error.message,
      });
      setIsPublishing(false);
    },
  });

  // Unpublish mutation
  const unpublishMutation = trpc.article.unpublish.useMutation({
    onSuccess: () => {
      toast.success("Saved as draft", {
        description: "Your article has been saved as a draft.",
      });
      router.push("/hub/posts");
    },
    onError: (error) => {
      toast.error("Failed to save as draft", {
        description: error.message,
      });
    },
  });

  // Update mutation for saving as draft
  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      toast.success("Saved as draft", {
        description: "Your article has been saved as a draft.",
      });
      router.push("/hub/posts");
    },
    onError: (error) => {
      toast.error("Failed to save", {
        description: error.message,
      });
    },
  });

  // Load existing article settings
  useEffect(() => {
    if (!articleData) return;

    const currentVisibility = articleData.visibility as
      | "public"
      | "private"
      | "supporters"
      | "members";
    const currentTags = (articleData.tags as string[]) || [];
    const currentNotify = articleData.notifyFollowers;

    setVisibility(currentVisibility);
    setTags(currentTags);
    setNotifyFollowers(currentNotify);
  }, [articleData]);

  const handlePublish = () => {
    if (!articleId) {
      toast.error("No article to publish", {
        description: "Please write some content first.",
      });
      return;
    }

    setIsPublishing(true);
    publishMutation.mutate({
      id: articleId,
      visibility,
      notifyFollowers,
      tags,
    });
  };

  const handleSaveAsDraft = () => {
    if (!articleId) {
      toast.error("No article to save", {
        description: "Please write some content first.",
      });
      return;
    }

    unpublishMutation.mutate({
      id: articleId,
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex h-16 shrink-0 items-center justify-between px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb userName={userName} />
      </div>
      <div className="flex items-center gap-0.5 sm:gap-2">
        {isArticleRoute && (
          <div className="flex items-center gap-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-xl" size={"icon-sm"}>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Send /> Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarClock />
                  Schedule
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveAsDraft}>
                  {" "}
                  <Lock /> Save as draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Dialog for advanced publishing options */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="outline-none sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>One Last Step</DialogTitle>
                  <DialogDescription>
                    Set up your post preferences before we take care of the
                    publishing for you.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Visibility Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="select-post">Visibility</Label>
                    <Select
                      value={visibility}
                      onValueChange={(value) =>
                        setVisibility(
                          value as
                            | "public"
                            | "private"
                            | "supporters"
                            | "members",
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          id="select-post"
                          placeholder="Choose who can view your post"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Public</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              Anyone on the internet can view this post.
                            </p>
                          </div>
                        </SelectItem>

                        <SelectItem value="private">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Private</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              Only you can access and edit this post.
                            </p>
                          </div>
                        </SelectItem>

                        <SelectItem value="supporters">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                Supporters only
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              Visible exclusively to people who’ve supported
                              your work.
                            </p>
                          </div>
                        </SelectItem>

                        <SelectItem value="members">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Members only</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              Accessible to subscribed members of your
                              community.
                            </p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Notifications */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="notify"
                      checked={notifyFollowers}
                      onCheckedChange={(checked) =>
                        setNotifyFollowers(checked as boolean)
                      }
                    />
                    <Label htmlFor="notify" className="leading-snug">
                      Notify your followers, members, or supporters about this
                      post.
                    </Label>
                  </div>

                  <Separator />

                  {/* Tags Input */}
                  <div className="space-y-2">
                    <Label htmlFor="article-tags">Tags</Label>
                    <Input
                      id="article-tags"
                      placeholder="Add relevant tags (press Enter to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-primary/80"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Use tags to help readers discover your post more easily.
                    </p>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? "Publishing..." : "Publish Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
