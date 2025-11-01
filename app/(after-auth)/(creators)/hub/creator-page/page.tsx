"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Coffee,
  Package,
  FileText,
  Users,
  Settings,
  MapPin,
  Link as LinkIcon,
  Crown,
  LayoutPanelTop,
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

export default function CreatorPage() {
  const [started, setStarted] = useState(false);
  const [coffeeCount, setCoffeeCount] = useState(1);

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
    <div className="min-h-screen ">
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                  <AvatarImage src="/avatar.png" alt="Grenish" />
                  <AvatarFallback className="text-xl">GR</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Grenish Rai
                    </h2>
                    <p className="text-muted-foreground mt-1">@grenish</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>Developer</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>0 supporters</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  I build what I think will benefit me in a way. Also I do code
                  for living (at least that&apos;s what I want to think).
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Recent Supporters */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Supporters
                </h3>
              </div>
              <Card>
                <CardContent className="p-8">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users className="h-10 w-10" />
                      </EmptyMedia>
                      <EmptyTitle>No supporters yet</EmptyTitle>
                      <EmptyDescription>
                        When people support you, they&apos;ll appear here.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </CardContent>
              </Card>
            </div>

            {/* Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Posts
                </h3>
                <Button size="sm">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  New Post
                </Button>
              </div>
              <Card>
                <CardContent className="p-8">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileText className="h-10 w-10" />
                      </EmptyMedia>
                      <EmptyTitle>No posts yet</EmptyTitle>
                      <EmptyDescription>
                        Share updates, thoughts, and exclusive content with your
                        supporters.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Create Your First Post
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </div>

            {/* Shop */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shop
                </h3>
              </div>
              <Card>
                <CardContent className="p-8">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Package className="h-10 w-10" />
                      </EmptyMedia>
                      <EmptyTitle>Shop not set up</EmptyTitle>
                      <EmptyDescription>
                        Sell digital products, merchandise, or services to your
                        audience.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        Set Up Your Shop
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div>
            <div className="sticky top-20 space-y-6">
              {/* Support Card */}
              <Card className="shadow-sm border">
                <CardContent className="p-6 space-y-5">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Support my work
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Buy me a tea to keep me going
                    </p>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
                      <div className="w-10 h-10 rounded-md bg-background border flex items-center justify-center shrink-0">
                        <Coffee className="h-4 w-4" />
                      </div>
                      <div className="flex gap-1.5 flex-1">
                        {[1, 3, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setCoffeeCount(n)}
                            className={`
                              flex-1 h-9 rounded-full text-sm font-medium transition-all
                              ${
                                coffeeCount === n
                                  ? "bg-foreground text-background"
                                  : "bg-background hover:bg-accent"
                              }
                            `}
                          >
                            {n}
                          </button>
                        ))}
                        <Input
                          type="number"
                          className="w-14 h-9 text-center text-sm p-0 bg-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="10"
                          min="1"
                          onChange={(e) =>
                            setCoffeeCount(parseInt(e.target.value) || 1)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Form Fields */}
                  <div className="space-y-3">
                    <Input
                      placeholder="Name or @social"
                      className="h-10 bg-muted/30 border-muted-foreground/20"
                    />

                    <Textarea
                      placeholder="Message (optional)"
                      rows={3}
                      className="resize-none text-sm bg-muted/30 border-muted-foreground/20"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2 text-sm">
                    <Label
                      htmlFor="private"
                      className="flex items-center gap-2.5 cursor-pointer hover:text-foreground transition-colors"
                    >
                      <Checkbox
                        id="private"
                        className="outline-none"
                        variant={"accent"}
                      />
                      Make this private
                    </Label>

                    <Label
                      htmlFor="monthly"
                      className="flex items-center gap-2.5 cursor-pointer hover:text-foreground transition-colors"
                    >
                      <Checkbox
                        id="monthly"
                        className="outline-none"
                        variant={"accent"}
                      />
                      <span>Make this monthly</span>
                    </Label>
                  </div>

                  {/* Support Button */}
                  <Button className="w-full h-11 font-medium" size="lg">
                    Support ₹{coffeeCount * 100}
                  </Button>
                </CardContent>
              </Card>

              {/* Membership Card */}
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 mb-1">
                      <Crown className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Become a Member</h3>
                    <p className="text-sm text-muted-foreground">
                      Get exclusive benefits and perks
                    </p>
                  </div>

                  <div className="pt-2">
                    <Empty>
                      <EmptyHeader>
                        <EmptyDescription className="text-center">
                          Membership tiers not set up yet. Offer exclusive
                          content to your supporters.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="mr-2 h-3.5 w-3.5" />
                          Set Up Membership
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
