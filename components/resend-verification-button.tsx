"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSent(true);

        // Show success state for 2 seconds, then refresh the page
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        let message = "Please try again later.";
        try {
          const errorData = await response.json();
          message = errorData?.message || message;
        } catch {
          const text = await response.text().catch(() => null);
          message = text || message;
        }
        alert(`Failed to send verification email: ${message}`);
      }
    } catch {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      if (!isSent) {
        setIsLoading(false);
      }
    }
  };

  if (isSent) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="whitespace-nowrap border-green-600 text-green-900 bg-green-50 dark:text-green-100 dark:bg-green-900/20"
        disabled
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Email Sent!
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="whitespace-nowrap border-amber-600 text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/20"
      onClick={handleResend}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Mail className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Sending..." : "Resend Email"}
    </Button>
  );
}
