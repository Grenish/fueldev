"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/core";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor;
  folder?: string;
  userId?: string;
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  editor,
  folder = "articles",
  userId,
}: ImageUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    queueMicrotask(() => {
      setError(null);
    });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      queueMicrotask(() => {
        setError("Please upload an image file");
      });
      return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      queueMicrotask(() => {
        setError("File size must be less than 10MB");
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      queueMicrotask(() => {
        setPreview(result);
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      queueMicrotask(() => {
        setIsDragging(false);
      });

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    queueMicrotask(() => {
      setIsDragging(true);
    });
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    queueMicrotask(() => {
      setIsDragging(false);
    });
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleInsertImage = async () => {
    if (!preview) return;

    // Validate editor is ready
    if (!editor || editor.isDestroyed) {
      setError("Editor is not ready. Please try again.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convert base64 to blob
      const base64Response = await fetch(preview);
      const blob = await base64Response.blob();

      // Determine file extension from blob type
      const extension = blob.type.split("/")[1] || "png";
      const file = new File([blob], `image.${extension}`, { type: blob.type });

      // Get signature from server
      const cloudinaryFolder = userId
        ? `fueldev/${folder}/${userId}`
        : `fueldev/${folder}`;

      const signResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: cloudinaryFolder,
          public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          upload_preset: "fueldev-compress",
        }),
      });

      if (!signResponse.ok) {
        const errorText = await signResponse.text();
        console.error("Sign response error:", errorText);
        throw new Error("Failed to get upload signature");
      }

      const signData = await signResponse.json();

      if (!signData.signature || !signData.apiKey || !signData.cloudName) {
        throw new Error("Invalid signature data received");
      }

      // Create form data for Cloudinary upload
      // IMPORTANT: Use the EXACT same parameters that were signed
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", signData.folder);
      formData.append("public_id", signData.public_id);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("upload_preset", signData.upload_preset);
      formData.append("api_key", signData.apiKey);
      formData.append("signature", signData.signature);

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error("Cloudinary upload error:", errorData);
        throw new Error(
          errorData.error?.message ||
            `Upload failed with status ${uploadResponse.status}`,
        );
      }

      const uploadData = await uploadResponse.json();

      if (!uploadData.secure_url) {
        throw new Error("No URL returned from Cloudinary");
      }

      // Verify editor is still valid before inserting
      if (!editor || editor.isDestroyed) {
        throw new Error("Editor was destroyed during upload");
      }

      // Insert the Cloudinary URL into the editor
      // Defer to avoid flushSync warning
      queueMicrotask(() => {
        try {
          if (editor && !editor.isDestroyed) {
            editor
              .chain()
              .focus()
              .setImage({ src: uploadData.secure_url, alt: "" })
              .run();
          }
        } catch (insertError) {
          console.error("Error inserting image into editor:", insertError);
        }
      });

      handleClose();
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    queueMicrotask(() => {
      setPreview(null);
      setError(null);
      setIsDragging(false);
      setIsUploading(false);
    });
    onOpenChange(false);
  };

  const handleRemovePreview = () => {
    queueMicrotask(() => {
      setPreview(null);
      setError(null);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="outline-none">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image to add it to your document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative rounded-lg border-2 border-dashed transition-colors",
                isDragging
                  ? "border-primary/80 bg-accent/50"
                  : "border-input hover:border-primary/50",
              )}
            >
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-transparent px-6 py-12 transition-colors",
                  isUploading && "cursor-not-allowed opacity-50",
                )}
              >
                <div className="mb-4">
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-sm font-semibold">
                    {isDragging
                      ? "Drop your image here"
                      : "Drag and drop an image here"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: PNG, JPG, GIF, WebP (up to 10MB)
                  </p>
                </div>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </label>

              {isDragging && (
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-accent/30">
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-primary" />
                    <p className="mt-3 text-sm font-semibold">
                      Drop image here
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-lg border bg-muted/30 p-3">
                <button
                  onClick={handleRemovePreview}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-md transition-transform hover:scale-110"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* eslint-disable @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 w-full rounded object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Image ready to insert
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleInsertImage}
            disabled={!preview || isUploading}
          >
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
