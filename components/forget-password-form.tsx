"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/auth-client";
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: "/auth/forgot-password/reset",
      });

      if (result.error) {
        setError(result.error.message || "Failed to send reset email");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We&apos;ve sent you a password reset link. Please check your email
              and follow the instructions.
            </p>
          </div>

          <div className="bg-green-500/15 text-green-700 dark:text-green-400 rounded-md p-3 text-sm">
            Password reset email sent successfully!
          </div>

          <Field>
            <Button type="button" onClick={() => router.push("/auth/login")}>
              Back to Login
            </Button>
          </Field>

          <FieldDescription className="text-center">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => setSuccess(false)}
              className="underline underline-offset-4"
            >
              Try again
            </button>
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
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
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
