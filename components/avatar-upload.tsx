"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, ImageIcon, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

interface AvatarUploadProps {
  userId: string;
  currentImage?: string | null;
  userName?: string | null;
  onUploadSuccess: (imageUrl: string) => void;
  isUploading?: boolean;
  className?: string;
}

export function AvatarUpload({
  userId,
  currentImage,
  userName,
  onUploadSuccess,
  isUploading = false,
  className,
}: AvatarUploadProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PNG, JPG, JPEG, or WEBP image";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Get signature from server
      const signResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: `fueldev/avatars/${userId}`,
          public_id: "avatar",
        }),
      });

      if (!signResponse.ok) {
        const errorText = await signResponse.text();
        console.error("Sign response error:", errorText);
        throw new Error("Failed to get upload signature");
      }

      const signData = await signResponse.json();
      console.log("Sign data received:", {
        hasSignature: !!signData.signature,
        hasApiKey: !!signData.apiKey,
        hasCloudName: !!signData.cloudName,
        timestamp: signData.timestamp,
      });

      if (!signData.cloudName) {
        throw new Error("Cloud name not received from server");
      }

      // Create form data for Cloudinary upload
      // Order matters for Cloudinary API
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "ml_default");
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("folder", `fueldev/avatars/${userId}`);
      formData.append("public_id", "avatar");
      formData.append("signature", signData.signature);

      // Log form data for debugging
      console.log("Form data entries:");
      for (const [key, value] of formData.entries()) {
        console.log(
          `  ${key}:`,
          key === "file" ? `[File: ${selectedFile.name}]` : value,
        );
      }

      console.log("Uploading to Cloudinary:", signData.cloudName);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json();
      console.log("Cloudinary response status:", uploadResponse.status);
      console.log("Cloudinary response data:", uploadData);

      if (!uploadResponse.ok) {
        console.error("Cloudinary upload error:", {
          status: uploadResponse.status,
          data: uploadData,
        });
        const errorMessage =
          uploadData.error?.message ||
          uploadData.error ||
          "Failed to upload image to Cloudinary";
        throw new Error(errorMessage);
      }

      if (!uploadData.secure_url) {
        console.error("No secure_url in response:", uploadData);
        throw new Error("Upload succeeded but no image URL was returned");
      }

      console.log("Upload successful:", uploadData.secure_url);
      await onUploadSuccess(uploadData.secure_url);

      // Close dialog and reset state
      setOpen(false);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = preview || currentImage;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Camera className="h-4 w-4 mr-2" />
          Update Profile Picture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. Square images work best and will be
            cropped to 1:1 aspect ratio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32 ring-4 ring-offset-4 ring-offset-background ring-border">
                <AvatarImage
                  src={displayImage || undefined}
                  alt={userName || "User"}
                />
                <AvatarFallback className="text-4xl">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              {preview && (
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary flex items-center justify-center ring-4 ring-background shadow-lg">
                  <ImageIcon className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-accent/50",
              "cursor-pointer group",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading || isUploading}
            />

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {selectedFile ? (
                    <span className="text-primary">{selectedFile.name}</span>
                  ) : (
                    <>
                      Click to upload or{" "}
                      <span className="text-primary">drag and drop</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, JPEG or WEBP (max. 5MB)
                </p>
              </div>
              {selectedFile && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={uploading || isUploading}
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            disabled={uploading || isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || isUploading}
          >
            {uploading || isUploading ? (
              <>
                <Spinner />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Picture
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
