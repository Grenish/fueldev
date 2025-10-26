import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ResendVerificationButton } from "@/components/resend-verification-button";
import { AccountSettingsTabs } from "@/components/settings/account-settings-tabs";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

// Force dynamic rendering and disable caching to always show fresh data
export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;

  // Fetch user's connected accounts
  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      providerId: true,
      accountId: true,
      createdAt: true,
      password: true,
    },
  });

  // Check if user has a password set (for password-based auth)
  const hasPassword = accounts.some((acc) => acc.password !== null);

  // Filter out credential accounts for connected apps display
  const connectedAccounts = accounts.filter(
    (acc) => acc.providerId !== "credential",
  );

  return (
    <Suspense fallback={<Spinner />}>
      <div className="flex flex-col items-center justify-center p-2">
        <div className="w-full lg:w-3/4 xl:w-2/3 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Account Settings
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage your account, security, and connected services
            </p>
          </div>

          {/* Email Verification Alert */}
          {!user.emailVerified && (
            <Alert
              variant="default"
              className="border-amber-500 bg-amber-50 dark:bg-amber-950/20"
            >
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-900 dark:text-amber-100">
                Email Verification Required
              </AlertTitle>
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span>
                    Please verify your email address to access all features.
                    Check your inbox for the verification link.
                  </span>
                  <ResendVerificationButton email={user.email} />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs Component */}
          <AccountSettingsTabs
            user={user}
            currentSession={session.session}
            hasPassword={hasPassword}
            connectedAccounts={connectedAccounts}
          />
        </div>
      </div>
    </Suspense>
  );
}
