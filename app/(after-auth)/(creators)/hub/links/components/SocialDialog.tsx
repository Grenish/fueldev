"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Search, ArrowLeft, AlertTriangle } from "lucide-react";
import { Social, SavedSocial } from "../types";
import { socialsMap, nsfwPlatforms } from "../constants";

interface SocialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedSocials: SavedSocial[];
  onSave: (social: SavedSocial) => void;
}

export function SocialDialog({
  open,
  onOpenChange,
  savedSocials,
  onSave,
}: SocialDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);
  const [socialUrl, setSocialUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);

  const filteredSocials = socialsMap.filter((s) =>
    s.iconName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const canShowNsfwOption = (iconName: string) =>
    nsfwPlatforms.includes(iconName);

  const handleSocialClick = (social: Social) => {
    setSelectedSocial(social);
    const existing = savedSocials.find((s) => s.iconName === social.iconName);
    if (existing) {
      setSocialUrl(existing.url);
      setCustomName(existing.customName || "");
      setIsNsfw(existing.isNsfw || false);
    } else {
      setSocialUrl("");
      setCustomName("");
      setIsNsfw(false);
    }
  };

  const handleBack = () => {
    setSelectedSocial(null);
    setSocialUrl("");
    setCustomName("");
    setIsNsfw(false);
  };

  const handleSave = () => {
    if (!selectedSocial || !socialUrl.trim()) return;
    if (selectedSocial.iconName === "Custom Link" && !customName.trim()) return;

    onSave({
      iconName: selectedSocial.iconName,
      url: socialUrl,
      icon: selectedSocial.icon,
      customName:
        selectedSocial.iconName === "Custom Link" ? customName : undefined,
      isNsfw: isNsfw,
    });

    // Reset
    setSelectedSocial(null);
    setSocialUrl("");
    setCustomName("");
    setIsNsfw(false);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setSelectedSocial(null);
      setSocialUrl("");
      setCustomName("");
      setIsNsfw(false);
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl">
        {!selectedSocial ? (
          <>
            <DialogHeader>
              <DialogTitle>Add Social Link</DialogTitle>
              <DialogDescription>
                Select a social media platform to add to your profile
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <Label htmlFor="social-search">Search platforms</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="social-search"
                    type="search"
                    placeholder="Search social platform"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredSocials.length > 0 ? (
                <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-7 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {filteredSocials.map((social) => (
                    <Tooltip key={social.id}>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-14 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => handleSocialClick(social)}
                        >
                          <social.icon className="size-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{social.iconName}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search />
                      </EmptyMedia>
                      <EmptyTitle>No social platforms found</EmptyTitle>
                      <EmptyDescription>
                        Try searching with a different keyword
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-9"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <div>
                  <DialogTitle>Add {selectedSocial.iconName}</DialogTitle>
                  <DialogDescription>
                    Enter your profile information
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="flex justify-center">
                <div className="size-20 rounded-lg border-2 flex items-center justify-center bg-muted">
                  <selectedSocial.icon className="size-10" />
                </div>
              </div>

              <div className="space-y-4">
                {selectedSocial.iconName === "Custom Link" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-name">Link Name</Label>
                    <Input
                      id="custom-name"
                      type="text"
                      placeholder="e.g., Portfolio, Blog, Website"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                      Give your custom link a descriptive name
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="social-url">
                    {selectedSocial.iconName === "Custom Link"
                      ? "URL"
                      : "Profile URL"}
                  </Label>
                  <Input
                    id="social-url"
                    type="url"
                    placeholder={
                      selectedSocial.iconName === "Custom Link"
                        ? "https://example.com"
                        : `https://${selectedSocial.iconName.toLowerCase().replace(/\s+/g, "")}.com/yourprofile`
                    }
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    autoFocus={selectedSocial.iconName !== "Custom Link"}
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedSocial.iconName === "Custom Link"
                      ? "Enter the full URL including https://"
                      : `Enter the full URL to your ${selectedSocial.iconName} profile`}
                  </p>
                </div>

                {canShowNsfwOption(selectedSocial.iconName) && (
                  <div className="flex items-start space-x-3 rounded-lg border p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                    <Checkbox
                      id="nsfw-checkbox"
                      checked={isNsfw}
                      onCheckedChange={(checked) =>
                        setIsNsfw(checked as boolean)
                      }
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="nsfw-checkbox"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-500" />
                        Mark as NSFW (18+)
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Visitors will see a warning before accessing this link
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={
                    !socialUrl.trim() ||
                    (selectedSocial.iconName === "Custom Link" &&
                      !customName.trim())
                  }
                >
                  Save Link
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
