"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Pencil, Check, Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl?: string;
  onEditBio?: (newBio: string) => void;
  onEditHandle?: (newHandle: string) => Promise<void>;
}

export function ProfileCard({
  name,
  handle,
  bio,
  avatarUrl,
  onEditBio,
  onEditHandle,
}: ProfileCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bioText, setBioText] = useState(bio);
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState(handle);
  const [debouncedHandle, setDebouncedHandle] = useState("");
  const [isSavingHandle, setIsSavingHandle] = useState(false);

  // Query to check if user can change handle
  const { data: canChangeData } = trpc.userLinks.canChangeHandle.useQuery();

  // Query to check handle availability (only runs when debouncedHandle is set)
  const { data: availabilityData, isLoading: isCheckingHandle } =
    trpc.userLinks.checkHandleAvailability.useQuery(
      { handle: debouncedHandle },
      {
        enabled: !!debouncedHandle && isEditingHandle,
      },
    );

  // Debounce handle input
  useEffect(() => {
    const normalizedInput = handleInput.startsWith("@")
      ? handleInput.slice(1)
      : handleInput;
    const normalizedCurrent = handle.startsWith("@") ? handle.slice(1) : handle;

    // If not editing, handle unchanged, or too short, don't check
    if (
      !isEditingHandle ||
      normalizedInput === normalizedCurrent ||
      !normalizedInput ||
      normalizedInput.length < 3
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedHandle(`@${normalizedInput}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [handleInput, isEditingHandle, handle]);

  // Determine handle availability status
  const isHandleAvailable = (() => {
    const normalizedInput = handleInput.startsWith("@")
      ? handleInput.slice(1)
      : handleInput;
    const normalizedCurrent = handle.startsWith("@") ? handle.slice(1) : handle;

    // If handle hasn't changed, it's available
    if (normalizedInput === normalizedCurrent) return true;

    // If too short, not available
    if (!normalizedInput || normalizedInput.length < 3) return false;

    // If checking or no data yet, return null
    if (isCheckingHandle || !debouncedHandle) return null;

    // Return the actual availability
    return availabilityData?.available ?? null;
  })();

  const handleSave = () => {
    if (onEditBio) {
      onEditBio(bioText);
    }
    setIsEditDialogOpen(false);
  };

  const handleCancel = () => {
    setBioText(bio); // Reset to original bio
    setIsEditDialogOpen(false);
  };

  const handleEditHandleClick = () => {
    // If data is still loading, don't allow editing yet
    if (!canChangeData) {
      return;
    }

    if (!canChangeData.canChange) {
      const daysText =
        canChangeData.daysRemaining === 1
          ? "1 day"
          : `${canChangeData.daysRemaining} days`;
      toast.error(`You can change your handle again in ${daysText}`, {
        description: "Handles can only be changed once every 60 days.",
      });
      return;
    }
    setIsEditingHandle(true);
    setHandleInput(handle);
  };

  const handleSaveHandle = async () => {
    if (!isHandleAvailable) {
      toast.error("Please choose an available handle");
      return;
    }

    const normalizedInput = handleInput.startsWith("@")
      ? handleInput
      : `@${handleInput}`;

    if (onEditHandle) {
      setIsSavingHandle(true);
      try {
        await onEditHandle(normalizedInput);
        setIsEditingHandle(false);
        toast.success("Handle updated successfully!");
      } catch {
        toast.error("You can only change your handle once every 60 days.");
      } finally {
        setIsSavingHandle(false);
      }
    }
  };

  const handleCancelHandleEdit = () => {
    setIsEditingHandle(false);
    setHandleInput(handle);
  };

  return (
    <>
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <Avatar className="size-20 border-2 border-border">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-lg font-semibold">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile info */}
            <div className="flex flex-col w-full text-center sm:text-left">
              <h2 className="text-xl font-semibold text-foreground">{name}</h2>
              <div className="inline-flex items-center gap-1">
                {!isEditingHandle ? (
                  <>
                    <p className="text-sm text-muted-foreground mt-1">
                      {handle}
                    </p>
                    <Button
                      variant={"link"}
                      size={"icon-sm"}
                      className="hover:underline"
                      onClick={handleEditHandleClick}
                      disabled={!canChangeData}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    {/* username input */}
                    <InputGroup className="w-48 h-8">
                      <InputGroupAddon align="inline-start">@</InputGroupAddon>
                      <InputGroupInput
                        value={
                          handleInput.startsWith("@")
                            ? handleInput.slice(1)
                            : handleInput
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/^@/, "");
                          setHandleInput(value);
                        }}
                        placeholder="username"
                        autoFocus
                      />
                      <InputGroupAddon align="inline-end">
                        {isCheckingHandle ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : isHandleAvailable === true ? (
                          <Check className="size-4 text-green-600" />
                        ) : isHandleAvailable === false ? (
                          <AlertCircle className="size-4 text-destructive" />
                        ) : null}
                      </InputGroupAddon>
                    </InputGroup>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "size-8",
                        (!isHandleAvailable || isSavingHandle) &&
                          "opacity-50 cursor-not-allowed",
                      )}
                      onClick={handleSaveHandle}
                      disabled={!isHandleAvailable || isSavingHandle}
                    >
                      {isSavingHandle ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={handleCancelHandleEdit}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              {/* Bio section */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm leading-relaxed text-foreground">{bio}</p>
                {onEditBio && (
                  <div className="flex justify-end mt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setBioText(bio);
                        setIsEditDialogOpen(true);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-4 mr-2" />
                      Edit Bio
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Bio Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Bio</DialogTitle>
            <DialogDescription>
              Update your bio to tell visitors about yourself. This will be
              displayed on your links page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Tell people about yourself..."
                className="min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bioText.length}/500 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
