"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function ResetPasswordFormContent({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam === "INVALID_TOKEN") {
      setTokenError("Invalid or expired reset link. Please request a new one.");
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setTokenError("No reset token found. Please request a new reset link.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError("No valid reset token found");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword({
        newPassword,
        token,
      });

      if (result.error) {
        setError(result.error.message || "Failed to reset password");
      } else {
        // Success - redirect to login
        router.push("/auth/login?reset=success");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground text-sm text-balance">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            {tokenError}
          </div>

          <Field>
            <Button
              type="button"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Request New Reset Link
            </Button>
          </Field>

          <FieldDescription className="text-center">
            <Link href="/auth/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </FieldGroup>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            required
            disabled={isLoading}
            minLength={8}
          />
          <FieldDescription>
            Password must be at least 8 characters long
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            required
            disabled={isLoading}
            minLength={8}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading || !token}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Remember your password?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return <ResetPasswordFormContent className={className} {...props} />;
}
