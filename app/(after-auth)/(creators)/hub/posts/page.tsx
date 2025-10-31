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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CreatorPage() {
  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-1/2 p-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full rounded-full">
              <Plus /> Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="outline-none">
            <DialogHeader>
              <DialogTitle>Create Something</DialogTitle>
              <DialogDescription>Create new damn post</DialogDescription>
            </DialogHeader>
            <div className="w-full flex items-center gap-2">
              <Link className="w-1/2" href={"posts/new/article"}>
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
      <div className="mt-2 w-1/2">
        <Tabs defaultValue="published">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
            <Search size={15} />
          </div>
          <TabsContent value="published">
            <Card className="p-2 gap-0">
              <CardHeader className="p-2 m-0">
                <CardDescription className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock size={15} />
                    Posted at Oct 30, 2025 at 01:30 PM
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis size={20} className="text-primary" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>View Post</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Pin this post</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Change visibility
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>Public</DropdownMenuItem>
                              <DropdownMenuItem>Private</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Unpublish</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="relative bg-muted w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/banner.png"
                    alt="post 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
              <CardHeader className="p-2">
                <CardTitle>Hello World</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet
                  consectetur adipiscing elit quisque faucibus ex sapien.
                  Quisque faucibus ex sapien vitae pellentesque sem placerat.
                  Vitae pellentesque sem placerat in id cursus mi...
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-2 flex items-center justify-between text-xs">
                <div className="gap-2 flex items-center text-muted-foreground">
                  <Globe2 size={15} /> Public
                </div>
                <div className="gap-6 flex items-center text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp size={15} />0
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChartArea size={15} />0
                  </div>
                </div>
              </CardFooter>
            </Card>
            {/*Empty Card*/}
            {/*<Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <Newspaper />
                </EmptyMedia>
                <EmptyTitle className="capitalize">
                  No posts published yet
                </EmptyTitle>
                <EmptyDescription>
                  Your published posts will appear here once you share them with
                  your supporters.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>*/}
          </TabsContent>
          <TabsContent value="draft">
            <Card className="p-2 gap-0">
              <CardHeader className="p-2 m-0">
                <CardDescription className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock size={15} />
                    Drafted at Oct 30, 2025 at 01:30 PM
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis size={20} className="text-primary" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>View Post</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Publish</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="relative bg-muted w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/banner.png"
                    alt="post 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
              <CardHeader className="p-2">
                <CardTitle>Hello World</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet
                  consectetur adipiscing elit quisque faucibus ex sapien.
                  Quisque faucibus ex sapien vitae pellentesque sem placerat.
                  Vitae pellentesque sem placerat in id cursus mi...
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-2 flex items-center justify-between text-xs">
                <div className="gap-2 flex items-center text-muted-foreground">
                  <Lock size={15} /> Draft
                </div>
              </CardFooter>
            </Card>
            {/*Empty card*/}
            {/*<Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <FileEdit />
                </EmptyMedia>
                <EmptyTitle className="capitalize">
                  No drafts saved yet
                </EmptyTitle>
                <EmptyDescription>
                  Start writing something - your unfinished posts will be saved
                  here automatically.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>*/}
          </TabsContent>
          <TabsContent value="scheduled">
            <Card className="p-2 gap-0">
              <CardHeader className="p-2 m-0">
                <CardDescription className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock size={15} />
                    Scheduled for Oct 30, 2025 at 01:30 PM
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis size={20} className="text-primary" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>View Post</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Publish now</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="relative bg-muted w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/banner.png"
                    alt="post 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
              <CardHeader className="p-2">
                <CardTitle>Hello World</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet
                  consectetur adipiscing elit quisque faucibus ex sapien.
                  Quisque faucibus ex sapien vitae pellentesque sem placerat.
                  Vitae pellentesque sem placerat in id cursus mi...
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-2 flex items-center justify-between text-xs">
                <div className="gap-2 flex items-center text-muted-foreground">
                  <CalendarClock size={15} /> Scheduled
                </div>
              </CardFooter>
            </Card>
            {/*Empty Card*/}
            {/*<Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <CalendarClock />
                </EmptyMedia>
                <EmptyTitle className="capitalize">
                  No scheduled posts
                </EmptyTitle>
                <EmptyDescription>
                  Plan ahead by scheduling a post to go live at a specific time
                  - they’ll show up here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>*/}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
