"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/avatar-upload";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

interface AccountTabProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    image?: string | null;
  };
}

export function AccountTab({ user }: AccountTabProps) {
  const router = useRouter();

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(user.image);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Handle name update
  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (name === user.name) {
      setIsEditingName(false);
      return;
    }

    setIsUpdatingName(true);

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update name");
      }

      toast.success("Name updated successfully");
      setIsEditingName(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update name",
      );
    } finally {
      setIsUpdatingName(false);
    }
  };

  // Handle email update
  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    if (email === user.email) {
      setIsEditingEmail(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsUpdatingEmail(true);

    try {
      const response = await fetch("/api/user/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update email");
      }

      toast.success(
        data.message ||
          "Email updated successfully. Please verify your new email.",
      );

      setIsEditingEmail(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update email",
      );
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (imageUrl: string) => {
    setIsUploadingAvatar(true);

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update avatar");
      }

      setAvatarUrl(imageUrl);
      toast.success("Profile picture updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update avatar",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 outline-none">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage
                    src={avatarUrl || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="text-lg">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium leading-none">
                    Profile Picture
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WEBP. Max 5MB.
                  </p>
                </div>
              </div>
              <AvatarUpload
                userId={user.id}
                currentImage={avatarUrl}
                userName={user.name}
                onUploadSuccess={handleAvatarUpload}
                isUploading={isUploadingAvatar}
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Name Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <AnimatePresence mode="wait">
                {!isEditingName ? (
                  <motion.div
                    key="edit-name"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                      className="h-8 gap-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save-name"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-center gap-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setName(user.name || "");
                        setIsEditingName(false);
                      }}
                      disabled={isUpdatingName}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleUpdateName}
                      disabled={isUpdatingName}
                      className="h-8 w-8 p-0"
                    >
                      {isUpdatingName ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {isEditingName ? (
                <motion.div
                  key="name-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isUpdatingName}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateName();
                      } else if (e.key === "Escape") {
                        setName(user.name || "");
                        setIsEditingName(false);
                      }
                    }}
                  />
                </motion.div>
              ) : (
                <motion.p
                  key="name-display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm text-muted-foreground"
                >
                  {user.name || "Not set"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-border" />

          {/* Email Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Badge
                  variant={user.emailVerified ? "default" : "secondary"}
                  className={cn(
                    "text-xs font-normal",
                    user.emailVerified
                      ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
                  )}
                >
                  {user.emailVerified ? "Verified" : "Not verified"}
                </Badge>
              </div>
              <AnimatePresence mode="wait">
                {!isEditingEmail ? (
                  <motion.div
                    key="edit-email"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingEmail(true)}
                      className="h-8 gap-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Change
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save-email"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-center gap-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEmail(user.email);
                        setIsEditingEmail(false);
                      }}
                      disabled={isUpdatingEmail}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleUpdateEmail}
                      disabled={isUpdatingEmail}
                      className="h-8 w-8 p-0"
                    >
                      {isUpdatingEmail ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {isEditingEmail ? (
                <motion.div
                  key="email-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isUpdatingEmail}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateEmail();
                      } else if (e.key === "Escape") {
                        setEmail(user.email);
                        setIsEditingEmail(false);
                      }
                    }}
                  />
                </motion.div>
              ) : (
                <motion.p
                  key="email-display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm text-muted-foreground"
                >
                  {user.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-border" />

          {/* User ID */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">User ID</Label>
            <p className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground break-all">
              {user.id}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Account Created */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Member Since</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
