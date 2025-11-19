"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  IndianRupee,
  ChevronRight,
  UploadCloud,
  Eye,
  Save,
  ChevronDown,
  Settings2,
  Package,
  BadgeQuestionMark,
  Smile,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/animate-ui/components/radix/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Create() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [limitedQuantityEnabled, setLimitedQuantityEnabled] = useState(false);
  const [askQuestionEnabled, setAskQuestionEnabled] = useState(false);
  const [memberDiscountEnabled, setMemberDiscountEnabled] = useState(false);
  const [customMessageEnabled, setCustomMessageEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen text-foreground">
      <nav className="sticky top-0 z-40 w-full border-b backdrop-blur-md ">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex gap-2"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye /> Preview
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <Save /> <span className="hidden sm:inline">Save</span>
            </Button>
            <Button size="sm" disabled={!termsAccepted}>
              Publish <ChevronRight className="h-3 w-3 opacity-50" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <div className="relative">
                <Input
                  placeholder="Name your product"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="text-4xl p-2 md:text-5xl font-bold tracking-tight shadow-none placeholder:text-muted-foreground/50 h-auto focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover Art
                </Label>
              </div>

              <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/20 transition-all hover:bg-muted/40 hover:border-primary/30 cursor-pointer">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground transition-transform duration-300 group-hover:scale-105">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Upload a cover image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1920 x 1080 recommended | Max 5 mb
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label
                htmlFor="prod-desc"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Product Details
              </Label>

              <Textarea
                id="prod-desc"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="resize-none h-[250px] shadow-none py-2 focus-visible:ring-0 border-none bg-transparent text-base leading-relaxed"
                placeholder="Explain what buyers will receive. Keep it clear and helpful."
              />
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Set the amount you want to charge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder="100"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="focus-visible:ring-0 font-medium bg-muted/20 border-transparent focus:bg-background focus:border-primary transition-all"
                    />
                    <InputGroupAddon>
                      <IndianRupee />
                    </InputGroupAddon>
                  </InputGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="">
                  <CardTitle className="text-sm font-semibold">
                    Configuration
                  </CardTitle>
                  <CardDescription>
                    Set the basic options for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Category</Label>
                    <Select>
                      <SelectTrigger className="w-full bg-muted/20 border-transparent">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="template">
                          Notion Template
                        </SelectItem>
                        <SelectItem value="ebook">E Book</SelectItem>
                        <SelectItem value="code">Source Code</SelectItem>
                        <SelectItem value="design">Design Assets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Files</Label>
                    <div className="rounded-md border border-dashed border-border p-4 text-center hover:bg-muted/20 transition-colors cursor-pointer">
                      <span className="text-xs text-muted-foreground font-medium">
                        Upload your file ZIP or PDF
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Card
                  className="shadow-sm hover:bg-muted/50 transition-colors cursor-pointer active:scale-[0.98] p-2"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                >
                  <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">Advanced</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        isAdvancedOpen ? "rotate-180" : ""
                      }`}
                    />
                  </CardContent>
                </Card>

                {isAdvancedOpen && (
                  <Card className="shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                      <CardDescription>
                        Extra controls for your product
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-center gap-2">
                            <Label className="text-xs">Limited Quantity</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeQuestionMark
                                  size={15}
                                  className="text-muted-foreground"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                Set a maximum number of purchases allowed
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Switch
                            checked={limitedQuantityEnabled}
                            onCheckedChange={setLimitedQuantityEnabled}
                          />
                        </div>

                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            placeholder="10"
                            disabled={!limitedQuantityEnabled}
                            className="focus-visible:ring-0 font-medium bg-muted/20 border-transparent focus:bg-background focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <InputGroupAddon>
                            <Package />
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-center gap-2">
                            <Label className="text-xs">Ask a Question</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeQuestionMark
                                  size={15}
                                  className="text-muted-foreground"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                Add a short question the buyer must answer
                                before checkout
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Switch
                            checked={askQuestionEnabled}
                            onCheckedChange={setAskQuestionEnabled}
                          />
                        </div>

                        <InputGroup>
                          <InputGroupInput
                            type="text"
                            placeholder="For example What is your name"
                            disabled={!askQuestionEnabled}
                            className="focus-visible:ring-0 font-medium bg-muted/20 border-transparent focus:bg-background focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <InputGroupAddon>
                            <UserCircle />
                          </InputGroupAddon>
                        </InputGroup>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-center gap-2">
                            <Label className="text-xs">Member Discount</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeQuestionMark
                                  size={15}
                                  className="text-muted-foreground"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                Give members a reduced price if you want
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Switch
                            checked={memberDiscountEnabled}
                            onCheckedChange={setMemberDiscountEnabled}
                          />
                        </div>

                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            placeholder="10"
                            disabled={!memberDiscountEnabled}
                            className="focus-visible:ring-0 font-medium bg-muted/20 border-transparent focus:bg-background focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <InputGroupAddon>
                            <IndianRupee />
                          </InputGroupAddon>
                        </InputGroup>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-center gap-2">
                            <Label className="text-xs">Custom Message</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeQuestionMark
                                  size={15}
                                  className="text-muted-foreground"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                Show a short note on the success page after
                                purchase
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Switch
                            checked={customMessageEnabled}
                            onCheckedChange={setCustomMessageEnabled}
                          />
                        </div>

                        <InputGroup>
                          <InputGroupInput
                            type="text"
                            placeholder="Thank you for your support"
                            disabled={!customMessageEnabled}
                            className="focus-visible:ring-0 font-medium bg-muted/20 border-transparent focus:bg-background focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <InputGroupAddon>
                            <Smile />
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Separator className="my-5" />

                <div className="flex gap-2 items-start">
                  <Checkbox
                    id="terms"
                    className="outline-none"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked as boolean)
                    }
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="terms">
                      I confirm this product is my own work
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      This confirms that the product you upload is original,
                      complies with all applicable copyright and legal
                      standards, and follows both platform guidelines and the
                      store policies agreed upon during setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-1/2 sm:max-w-sm outline-none">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="">
            <Card className="overflow-hidden w-full p-0">
              <div className="w-full h-[350px] overflow-hidden bg-linear-to-br from-primary/80 via-primary/60 to-primary/40 flex items-center justify-center">
                <h2 className="text-xl font-bold text-primary-foreground text-center leading-tight">
                  {productName || "Title"}
                </h2>
              </div>

              <CardContent className="px-2 pb-2 space-y-3">
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {productName || "Product Name"}
                  </h3>

                  <p className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap line-clamp-4">
                    {productDescription || "No description provided yet."}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center gap-1">
                  <IndianRupee size={20} />
                  <span className="text-2xl font-bold">{price || "0"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
