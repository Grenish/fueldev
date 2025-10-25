"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

interface SignOutButtonProps {
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

export function SignOutButton({
  variant = "outline",
  className,
  children = "Sign Out",
}: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Spinner /> Signing out...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
