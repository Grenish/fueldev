"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { AlertTriangle, Save, Loader2 } from "lucide-react";
import { ProfileCard } from "./components/ProfileCard";
import { SocialLinks } from "./components/SocialLinks";
import { BlockBuilder } from "./components/BlockBuilder";
import { PreviewPane } from "./components/PreviewPane";
import { SocialDialog } from "./components/SocialDialog";
import { AddBlockDialog } from "./components/AddBlockDialog";
import { AnyBlock, SavedSocial } from "./types";
import { trpc } from "@/lib/trpc/react";
import { toast } from "sonner";
import { socialsMap } from "./constants";
import { Spinner } from "@/components/ui/spinner";

export default function CreatorLinks() {
  // Fetch user links data
  const { data: userLinksData, isLoading } = trpc.userLinks.get.useQuery();
  const upsertMutation = trpc.userLinks.upsert.useMutation();

  // Profile state
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // Socials state
  const [savedSocials, setSavedSocials] = useState<SavedSocial[]>([]);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [nsfwWarningUrl, setNsfwWarningUrl] = useState<string | null>(null);

  // Blocks state
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [isAddBlockDialogOpen, setIsAddBlockDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AnyBlock | null>(null);

  // Track if there are unsaved changes
  const [isSaving, setIsSaving] = useState(false);

  // Store original data to compare against
  const originalDataRef = useRef<string>("");

  // Load data from tRPC
  useEffect(() => {
    if (userLinksData) {
      setName(userLinksData.name);
      setHandle(userLinksData.handle);
      setBio(userLinksData.bio);
      setAvatarUrl(userLinksData.avatarUrl || undefined);

      // Map icon components to saved socials
      const socialsFromDb = userLinksData.socials as unknown as Array<{
        iconName: string;
        url: string;
        isNsfw?: boolean;
        customName?: string;
      }>;

      const socialsWithIcons = socialsFromDb.map((social) => {
        const iconData = socialsMap.find((s) => s.iconName === social.iconName);
        return {
          iconName: social.iconName,
          url: social.url,
          isNsfw: social.isNsfw,
          customName: social.customName,
          icon: iconData?.icon || socialsMap[0].icon,
        };
      });
      setSavedSocials(socialsWithIcons as unknown as SavedSocial[]);
      setBlocks(userLinksData.blocks as unknown as AnyBlock[]);

      // Store stringified original data
      originalDataRef.current = JSON.stringify({
        name: userLinksData.name,
        handle: userLinksData.handle,
        bio: userLinksData.bio,
        avatarUrl: userLinksData.avatarUrl,
        socials: userLinksData.socials,
        blocks: userLinksData.blocks,
      });
    }
  }, [userLinksData]);

  // Check for unsaved changes using useMemo
  const hasUnsavedChanges = useMemo(() => {
    if (!originalDataRef.current) return false;

    const currentData = JSON.stringify({
      name,
      handle,
      bio,
      avatarUrl: avatarUrl ?? null,
      socials: savedSocials,
      blocks,
    });

    return currentData !== originalDataRef.current;
  }, [name, handle, bio, avatarUrl, savedSocials, blocks]);

  // Social handlers
  const handleAddSocial = () => {
    setIsSocialDialogOpen(true);
  };

  const handleSaveSocial = (social: SavedSocial) => {
    const filtered = savedSocials.filter((s) => s.iconName !== social.iconName);
    setSavedSocials([...filtered, social]);
  };

  const handleRemoveSocial = (iconName: string) => {
    setSavedSocials(savedSocials.filter((s) => s.iconName !== iconName));
  };

  const handleSocialIconClick = (e: React.MouseEvent, social: SavedSocial) => {
    if (social.isNsfw) {
      e.preventDefault();
      setNsfwWarningUrl(social.url);
    }
  };

  const handleNsfwProceed = () => {
    if (nsfwWarningUrl) {
      window.open(nsfwWarningUrl, "_blank", "noopener,noreferrer");
      setNsfwWarningUrl(null);
    }
  };

  // Block handlers
  const handleAddBlock = () => {
    setEditingBlock(null);
    setIsAddBlockDialogOpen(true);
  };

  const handleEditBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      setEditingBlock(block);
      setIsAddBlockDialogOpen(true);
    }
  };

  const handleSaveBlock = (block: AnyBlock) => {
    if (editingBlock) {
      // Update existing block
      setBlocks(blocks.map((b) => (b.id === block.id ? block : b)));
    } else {
      // Add new block
      setBlocks([...blocks, block]);
    }
    setEditingBlock(null);
  };

  const handleSaveMultipleBlocks = (newBlocks: AnyBlock[]) => {
    setBlocks([...blocks, ...newBlocks]);
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleMoveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const newBlocks = [...blocks];
    if (direction === "up" && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
    } else if (direction === "down" && index < blocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
    }
    setBlocks(newBlocks);
  };

  const handleScrollToPreview = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save changes to database
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await upsertMutation.mutateAsync({
        name,
        handle,
        bio,
        avatarUrl: avatarUrl ?? null,
        socials: savedSocials.map((s) => ({
          iconName: s.iconName,
          url: s.url,
          isNsfw: s.isNsfw ?? false,
          icon: undefined,
        })),
        blocks,
      });

      toast.success("Changes saved successfully!");

      // Update original data ref after successful save
      originalDataRef.current = JSON.stringify({
        name,
        handle,
        bio,
        avatarUrl: avatarUrl ?? null,
        socials: savedSocials.map((s) => ({
          iconName: s.iconName,
          url: s.url,
          isNsfw: s.isNsfw ?? false,
          icon: undefined,
        })),
        blocks,
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle bio edit
  const handleEditBio = (newBio: string) => {
    setBio(newBio);
  };

  // Handle handle edit - save directly to database
  const handleEditHandle = async (newHandle: string) => {
    try {
      await upsertMutation.mutateAsync({
        name,
        handle: newHandle,
        bio,
        avatarUrl: avatarUrl ?? null,
        socials: savedSocials.map((s) => ({
          iconName: s.iconName,
          url: s.url,
          isNsfw: s.isNsfw ?? false,
          icon: undefined,
        })),
        blocks,
      });

      // Update local state
      setHandle(newHandle);

      // Update original data ref after successful save
      originalDataRef.current = JSON.stringify({
        name,
        handle: newHandle,
        bio,
        avatarUrl: avatarUrl ?? null,
        socials: savedSocials.map((s) => ({
          iconName: s.iconName,
          url: s.url,
          isNsfw: s.isNsfw ?? false,
          icon: undefined,
        })),
        blocks,
      });
    } catch (error) {
      console.error("Error updating handle:", error);
      throw error; // Re-throw to let ProfileCard handle the error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-sm text-muted-foreground">
            Loading your links page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Save Button */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            size="lg"
            className="shadow-lg"
          >
            {isSaving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfileCard
              name={name}
              handle={handle}
              bio={bio}
              avatarUrl={avatarUrl}
              onEditBio={handleEditBio}
              onEditHandle={handleEditHandle}
            />

            <SocialLinks
              savedSocials={savedSocials}
              onAddClick={handleAddSocial}
              onRemove={handleRemoveSocial}
              onIconClick={handleSocialIconClick}
            />

            <BlockBuilder
              blocks={blocks}
              onAddBlock={handleAddBlock}
              onEditBlock={handleEditBlock}
              onRemoveBlock={handleRemoveBlock}
              onMoveBlock={handleMoveBlock}
              onScrollToPreview={handleScrollToPreview}
            />
          </div>

          <div className="lg:col-span-1">
            <PreviewPane
              name={name}
              handle={handle}
              bio={bio}
              avatarUrl={avatarUrl}
              savedSocials={savedSocials}
              blocks={blocks}
              onSocialClick={handleSocialIconClick}
            />
          </div>
        </div>
      </div>

      <SocialDialog
        open={isSocialDialogOpen}
        onOpenChange={setIsSocialDialogOpen}
        savedSocials={savedSocials}
        onSave={handleSaveSocial}
      />

      <AddBlockDialog
        open={isAddBlockDialogOpen}
        onOpenChange={setIsAddBlockDialogOpen}
        onSave={handleSaveBlock}
        onSaveMultiple={handleSaveMultipleBlocks}
        editingBlock={editingBlock}
      />

      <AlertDialog
        open={!!nsfwWarningUrl}
        onOpenChange={() => setNsfwWarningUrl(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Content Warning (18+)
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  This link has been marked as containing mature or sensitive
                  content (NSFW - Not Safe For Work).
                </p>
                <p className="font-medium text-foreground">
                  You must be 18 years or older to proceed.
                </p>
                <p className="text-sm text-muted-foreground">
                  By clicking &quot;I Am 18+ and Aware&quot;, you confirm that
                  you are of legal age and understand the nature of the content.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNsfwWarningUrl(null)}>
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
