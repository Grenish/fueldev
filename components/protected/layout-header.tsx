"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/protected/dynamic-breadcrumb";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  Ellipsis,
  EllipsisVertical,
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
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
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

interface LayoutHeaderProps {
  userName: string;
}

export function LayoutHeader({ userName }: LayoutHeaderProps) {
  const pathname = usePathname();
  const isArticleRoute = pathname === "/hub/posts/new/article";

  const [open, setOpen] = useState(false);

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
                <DropdownMenuItem>
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
                    <Select>
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
                    <Checkbox id="notify" />
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
                    />
                    <p className="text-xs text-muted-foreground">
                      Use tags to help readers discover your post more easily.
                    </p>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button>Publish Post</Button>
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
