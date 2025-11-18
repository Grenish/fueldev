"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Image as ImageIcon,
  Settings2,
  DollarSign,
  Globe,
  Lock,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Create() {
  const [tags, setTags] = useState<string[]>(["Design", "Template"]);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-background font-sans text-foreground selection:bg-orange-100 selection:text-orange-900">
      {/* --- Minimal Navigation --- */}
      <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/70 px-6 backdrop-blur-xl transition-all">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Products</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground">New Item</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Save Draft
          </Button>
          <Button
            size="sm"
            className="rounded-full px-6 font-medium shadow-none"
          >
            Publish
          </Button>
        </div>
      </nav>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[1fr_350px]">
        {/* --- LEFT COLUMN: The "Canvas" (Expressive & Clean) --- */}
        <div className="space-y-10">
          {/* 1. Title & Intro */}
          <div className="group relative space-y-2">
            <Input
              placeholder="Product Name"
              className="h-auto border-none bg-transparent px-0 text-5xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 md:text-6xl"
            />
            <Input
              placeholder="Add a short tagline..."
              className="h-auto border-none bg-transparent px-0 text-xl font-medium text-muted-foreground placeholder:text-muted-foreground/30 focus-visible:ring-0"
            />
          </div>

          {/* 2. The "Dropzone" (Natural & Visual) */}
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/5 transition-all hover:bg-muted/10 group">
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border transition-transform group-hover:scale-110">
                <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  Upload Media
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </div>
              <Button variant="secondary" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>

          {/* 3. Rich Text (Minimal) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <Label className="text-base font-medium text-foreground">
                About the product
              </Label>
              {/* Minimal Toolbar */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm"
                >
                  <span className="font-bold serif">B</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm"
                >
                  <span className="italic serif">I</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm"
                >
                  <UploadCloud className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Tell your story here..."
              className="min-h-[300px] resize-y border-none bg-transparent p-0 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: The "Control Panel" (Professional & Organized) --- */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="overflow-hidden border-border/50 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <span className="absolute left-0 top-1 text-3xl font-light text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-12 border-none bg-transparent pl-8 text-4xl font-bold tracking-tight focus-visible:ring-0"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Set to $0 for free products.
              </p>
            </CardContent>
          </Card>

          {/* Settings Stack */}
          <div className="space-y-4">
            {/* Category */}
            <div className="group rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/20">
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
              <Select>
                <SelectTrigger className="border-none bg-secondary/30 shadow-none focus:ring-0">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design Assets</SelectItem>
                  <SelectItem value="code">Software</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-normal"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 rounded-md px-2 text-xs text-muted-foreground"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Tag
                </Button>
              </div>
            </div>

            {/* Advanced Toggles */}
            <div className="rounded-xl border border-border/50 bg-card p-1">
              {[
                {
                  title: "Limit Quantity",
                  icon: <Lock className="h-4 w-4" />,
                },
                {
                  title: "SEO Settings",
                  icon: <Globe className="h-4 w-4" />,
                },
                {
                  title: "Advanced Options",
                  icon: <Settings2 className="h-4 w-4" />,
                },
              ].map((item, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="flex w-full items-center justify-between px-4 py-6 font-normal text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
