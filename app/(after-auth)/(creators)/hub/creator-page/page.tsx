"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Coffee,
  Package,
  FileText,
  Users,
  MapPin,
  Link as LinkIcon,
  Crown,
  LayoutPanelTop,
  Heart,
  MoreHorizontal,
  Plus,
  Sparkles,
  Calendar,
  Share,
  Flag,
  UserPlus,
  Bell,
  BellOff,
  CircleDollarSign,
  TrendingUp,
  ShoppingBag,
  Zap,
  CheckCircle2,
  MessageCircle,
  Lock,
  RefreshCw,
  User,
  HatGlasses,
  VenetianMask,
  Pencil,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CreatorPage() {
  const [started, setStarted] = useState(false);
  const [supportAmount, setSupportAmount] = useState("500");
  const [selectedTab, setSelectedTab] = useState("posts");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);

  if (!started) {
    return (
      <div className="min-h-full w-full flex items-center justify-center p-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutPanelTop className="h-12 w-12" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl">
              Start Your Creator Journey
            </EmptyTitle>
            <EmptyDescription className="text-base">
              Create your page and start receiving support from your community.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="lg" onClick={() => setStarted(true)}>
              Create Your Page
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Profile Header Section */}
        <div className="space-y-8">
          {/* Top Section with Avatar and Actions */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: Profile Info */}
            <div className="flex gap-4 lg:gap-6 flex-1">
              <Avatar className="h-24 w-24 lg:h-32 lg:w-32 ring-4 ring-background shadow-xl">
                <AvatarImage src="/avatar.png" alt="Grenish" />
                <AvatarFallback className="text-2xl lg:text-3xl">
                  GR
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                      Grenish Rai
                    </h1>
                    <Badge variant="default" className="rounded-full">
                      <CheckCircle2 />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">@grenish</p>
                </div>

                <p className="text-sm lg:text-base text-foreground/80 max-w-2xl">
                  I build what I think will benefit me in a way. Also I do code
                  for living — crafting digital experiences one line at a time.
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>San Francisco</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <LinkIcon className="h-3.5 w-3.5" />
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      grenish.dev
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Joined October 2023</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 lg:min-w-[200px]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="default">
                    <Heart className="h-4 w-4 mr-2" />
                    Support
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] outline-none">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl p-2 border-2 flex items-center justify-center">
                        {isPrivate ? <HatGlasses /> : <Heart />}
                      </div>
                      <div>
                        <DialogTitle className="text-xl">Grenish</DialogTitle>
                        <DialogDescription>
                          Support the creator you love
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 pt-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { value: "100" },
                          { value: "500" },
                          { value: "1000" },
                          { value: "1500" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={"ghost"}
                            onClick={() => setSupportAmount(option.value)}
                            className={`relative group h-12 rounded-xl border-2 outline-none transition-all ${
                              supportAmount === option.value
                                ? "bg-border/30 shadow-sm"
                                : "border-border hover:border-foreground/30"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center h-full gap-1.5">
                              <span
                                className={`text-lg font-semibold ${
                                  supportAmount === option.value
                                    ? ""
                                    : "text-muted-foreground"
                                }`}
                              >
                                ₹{option.value}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          placeholder="Or enter custom amount"
                          value={supportAmount}
                          onChange={(e) => setSupportAmount(e.target.value)}
                          className="h-12 pl-8"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {!isPrivate ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Your name
                            </Label>
                          </div>
                          <Input
                            id="name"
                            placeholder="Anonymous"
                            className="h-10"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <VenetianMask className="h-3.5 w-3.5 text-muted-foreground" />
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Who?
                            </Label>
                          </div>
                          <div className="h-10 w-full rounded-md flex items-center justify-center bg-border/50 border border-foreground/20">
                            <HatGlasses />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label
                            htmlFor="message"
                            className="text-sm font-medium"
                          >
                            Say something nice
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            (optional)
                          </span>
                        </div>
                        <Textarea
                          id="message"
                          placeholder="Thanks for your amazing work! Keep it up 🚀"
                          className="resize-none min-h-[80px]"
                        />
                      </div>
                    </div>

                    {/* Options with better visual design */}
                    <div className="space-y-2 p-4 rounded-lg bg-muted/40">
                      <label
                        htmlFor="private"
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          id="private"
                          checked={isPrivate}
                          onCheckedChange={setIsPrivate}
                          className="mt-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Private support
                            </span>
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Only you will see this
                          </p>
                        </div>
                      </label>

                      <Separator className="my-3" />

                      <label
                        htmlFor="monthly"
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          id="monthly"
                          checked={isMonthly}
                          onCheckedChange={setIsMonthly}
                          className="mt-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Monthly support
                            </span>
                            <RefreshCw className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Support every month, cancel anytime
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Submit Button with dynamic content */}
                    <div className="space-y-3">
                      <Button className="w-full">
                        {isPrivate ? <HatGlasses /> : <Heart />}
                        {isMonthly ? (
                          <>Support with ₹{supportAmount}/month</>
                        ) : (
                          <>Send ₹{supportAmount}</>
                        )}
                      </Button>

                      <p className="text-center text-xs text-muted-foreground">
                        Secured payment • Cancel anytime
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-sm">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Share />
                    Share Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LinkIcon />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Pencil />
                    Edit Page
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-8"
          >
            <TabsList className="w-full justify-start h-12 p-1 bg-muted/30">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="supporters"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Supporters
              </TabsTrigger>
              <TabsTrigger
                value="membership"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Crown className="h-4 w-4 mr-2" />
                Membership
              </TabsTrigger>
              <TabsTrigger
                value="shop"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop
              </TabsTrigger>
            </TabsList>

            {/* Posts Content */}
            <TabsContent value="posts" className="space-y-4">
              <Card className="border-dashed">
                <CardContent className="py-16">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileText className="h-10 w-10" />
                      </EmptyMedia>
                      <EmptyTitle>No posts yet</EmptyTitle>
                      <EmptyDescription>
                        Share your first update with your followers
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button>
                        <Plus />
                        Create Post
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Supporters Content */}
            <TabsContent value="supporters" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Supporters */}
                <Card className="border-dashed">
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Recent Supporters
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <Empty>
                      <EmptyDescription className="text-xs">
                        Your supporters will appear here
                      </EmptyDescription>
                    </Empty>
                  </CardContent>
                </Card>

                {/* Top Supporter */}
                <Card className="border-dashed">
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Top Supporter
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <Empty>
                      <EmptyDescription className="text-xs">
                        Your biggest supporter will be featured here
                      </EmptyDescription>
                    </Empty>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Membership Content */}
            <TabsContent value="membership" className="space-y-6">
              <Card className="border-dashed">
                <CardContent className="py-16">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Crown className="h-10 w-10" />
                      </EmptyMedia>
                      <EmptyTitle>No membership tiers</EmptyTitle>
                      <EmptyDescription>
                        Create membership plans to offer exclusive perks to your
                        supporters
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button>
                        <Plus />
                        Create Membership Tier
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shop Content */}
            <TabsContent value="shop" className="space-y-4">
              <Card className="border-dashed">
                <CardContent className="py-16">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Package className="h-10 w-10" />
                      </EmptyMedia>
                      <EmptyTitle>Your shop is empty</EmptyTitle>
                      <EmptyDescription>
                        Start selling digital products, services, or merchandise
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button>
                        <Plus />
                        Add Product
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
