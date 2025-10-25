"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc/react";
import { signOut } from "@/lib/auth-client";

interface DeleteAccountButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  children?: React.ReactNode;
}

export function DeleteAccountButton({
  variant = "destructive",
  className,
  children = "Delete Account",
}: DeleteAccountButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: async () => {
      // Sign out the user after successful deletion
      await signOut();

      // Redirect to home page
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
      setIsOpen(false);
    },
  });

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
    } catch (error) {
      // Error is handled in onError callback
      console.error("Delete account error:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-2">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers, including:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your profile information</li>
                <li>All your posts and content</li>
                <li>Your supporter relationships</li>
                <li>Transaction history</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteAccountMutation.isPending
              ? "Deleting..."
              : "Yes, delete my account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
