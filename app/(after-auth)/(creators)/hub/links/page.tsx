"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Behance,
  Bluesky,
  CustomLink,
  Deviantart,
  Discord,
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mastodon,
  Medium,
  Onlyfans,
  Patreon,
  Pinterest,
  Reddit,
  Rss,
  Threads,
  Twitch,
  X,
  Youtube,
} from "@/public/icons";
import { useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Checkbox } from "@/components/ui/checkbox";

type Social = {
  id: number;
  iconName: string;
  icon: React.ComponentType<{ className?: string }>;
};

type SavedSocial = {
  iconName: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  customName?: string;
  isNsfw?: boolean;
};

export default function CreatorLinks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);
  const [socialUrl, setSocialUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);
  const [savedSocials, setSavedSocials] = useState<SavedSocial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nsfwWarning, setNsfwWarning] = useState<SavedSocial | null>(null);

  const socialsMap: Social[] = [
    { id: 0, iconName: "RSS", icon: Rss },
    { id: 1, iconName: "Patreon", icon: Patreon },
    { id: 2, iconName: "Twitch", icon: Twitch },
    { id: 3, iconName: "Threads", icon: Threads },
    { id: 4, iconName: "Reddit", icon: Reddit },
    { id: 5, iconName: "Pinterest", icon: Pinterest },
    { id: 6, iconName: "OnlyFans", icon: Onlyfans },
    { id: 7, iconName: "Medium", icon: Medium },
    { id: 8, iconName: "Mastodon", icon: Mastodon },
    { id: 9, iconName: "LinkedIn", icon: Linkedin },
    { id: 10, iconName: "Instagram", icon: Instagram },
    { id: 11, iconName: "GitHub", icon: Github },
    { id: 12, iconName: "Facebook", icon: Facebook },
    { id: 13, iconName: "Dribbble", icon: Dribbble },
    { id: 14, iconName: "Discord", icon: Discord },
    { id: 15, iconName: "DeviantArt", icon: Deviantart },
    { id: 16, iconName: "Bluesky", icon: Bluesky },
    { id: 17, iconName: "Behance", icon: Behance },
    { id: 18, iconName: "YouTube", icon: Youtube },
    { id: 19, iconName: "X (Twitter)", icon: X },
    { id: 20, iconName: "Custom Link", icon: CustomLink },
  ];

  const nsfwPlatforms = [
    "OnlyFans",
    "Patreon",
    "X (Twitter)",
    "Discord",
    "DeviantArt",
    "Custom Link",
  ];

  const filteredSocials = socialsMap.filter((social) =>
    social.iconName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const canShowNsfwOption = (iconName: string) =>
    nsfwPlatforms.includes(iconName);

  const handleSocialClick = (social: Social) => {
    setSelectedSocial(social);
    // Pre-fill if already saved
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

    // Remove existing entry if updating
    const filtered = savedSocials.filter(
      (s) => s.iconName !== selectedSocial.iconName,
    );

    // Add new/updated entry
    setSavedSocials([
      ...filtered,
      {
        iconName: selectedSocial.iconName,
        url: socialUrl,
        icon: selectedSocial.icon,
        customName:
          selectedSocial.iconName === "Custom Link" ? customName : undefined,
        isNsfw: isNsfw,
      },
    ]);

    // Reset and close
    setSelectedSocial(null);
    setSocialUrl("");
    setCustomName("");
    setIsNsfw(false);
    setIsDialogOpen(false);
    setSearchQuery("");
  };

  const handleRemoveSocial = (iconName: string) => {
    setSavedSocials(savedSocials.filter((s) => s.iconName !== iconName));
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedSocial(null);
      setSocialUrl("");
      setCustomName("");
      setIsNsfw(false);
      setSearchQuery("");
    }
  };

  const handleSocialIconClick = (e: React.MouseEvent, social: SavedSocial) => {
    if (social.isNsfw) {
      e.preventDefault();
      setNsfwWarning(social);
    }
  };

  const handleNsfwProceed = () => {
    if (nsfwWarning) {
      window.open(nsfwWarning.url, "_blank", "noopener,noreferrer");
      setNsfwWarning(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full max-w-2xl">
        <Avatar className="size-20 shrink-0">
          <AvatarImage src="" alt="Creator avatar" />
          <AvatarFallback>FD</AvatarFallback>
        </Avatar>

        <div className="flex flex-col w-full">
          <h2 className="text-xl font-semibold">Grenish Rai</h2>
          <p className="text-sm font-medium text-muted-foreground">
            @grenish-rai
          </p>
          <div className="bg-card/50 mt-3 rounded-xl p-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit quisque
              faucibus ex sapien vitae pellentesque sem placerat in id cursus mi
              pretium tellus duis convallis tempus leo eu aenean sed diam urna
              tempor.
            </p>

            <div className="flex justify-end mt-2">
              <Button size="sm" variant="ghost">
                <Pencil className="size-4" /> Edit Bio
              </Button>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex items-center gap-2 flex-wrap">
            {/* Saved Social Icons */}
            {savedSocials.map((social) => (
              <Tooltip key={social.iconName}>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <Button
                      size="icon-lg"
                      variant="outline"
                      className="rounded-full relative"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleSocialIconClick(e, social)}
                      >
                        <social.icon className="size-5" />
                        {social.isNsfw && (
                          <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-background" />
                        )}
                      </a>
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 size-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveSocial(social.iconName);
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {social.customName || social.iconName}
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Add Button */}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      size="icon-lg"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Plus />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Add Socials</TooltipContent>
              </Tooltip>

              <DialogContent className="outline-none">
                {!selectedSocial ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Add Socials</DialogTitle>
                      <DialogDescription>
                        Select a social media platform to add
                      </DialogDescription>
                    </DialogHeader>

                    {/* Search field */}
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="social-search">Search</Label>
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
                    </div>

                    {/* Social icons grid */}
                    {filteredSocials.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[400px] overflow-y-auto">
                        {filteredSocials.map((social) => (
                          <Tooltip key={social.id}>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-lg"
                                variant="outline"
                                className="aspect-square flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                                onClick={() => handleSocialClick(social)}
                              >
                                <social.icon className="size-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{social.iconName}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
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
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={handleBack}
                        >
                          <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                          <DialogTitle>
                            Add {selectedSocial.iconName}
                          </DialogTitle>
                          <DialogDescription>
                            Enter your profile URL
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div className="flex justify-center">
                        <div className="size-16 rounded-full border-2 flex items-center justify-center bg-muted">
                          <selectedSocial.icon className="size-8" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {selectedSocial.iconName === "Custom Link" && (
                          <>
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
                              Give your custom link a name
                            </p>
                          </>
                        )}

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
                              : `https://${selectedSocial.iconName.toLowerCase()}.com/yourprofile`
                          }
                          value={socialUrl}
                          onChange={(e) => setSocialUrl(e.target.value)}
                          autoFocus={selectedSocial.iconName !== "Custom Link"}
                        />
                        <p className="text-xs text-muted-foreground">
                          {selectedSocial.iconName === "Custom Link"
                            ? "Enter the full URL"
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
                              This link may contain mature or sensitive content.
                              Visitors will see a warning before accessing it.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
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
                          Save
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <Separator className="my-5" />
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full max-w-2xl">
        <div className="flex items-center w-full gap-2">
          <Button className="w-1/2" variant={"default"} size={"sm"}>
            <Plus /> Add
          </Button>
          <Button className="w-1/2 border" variant={"ghost"} size={"sm"}>
            <ExternalLink /> Preview
          </Button>
        </div>
      </div>

      <AlertDialog
        open={!!nsfwWarning}
        onOpenChange={() => setNsfwWarning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Content Warning
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  This link has been marked as containing mature or sensitive
                  content (NSFW - Not Safe For Work).
                </p>
                <p className="font-medium text-foreground">
                  You must be 18 years or older to proceed.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNsfwWarning(null)}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleNsfwProceed}
              className="bg-amber-600 hover:bg-amber-700"
            >
              I Am 18+ and Aware
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
