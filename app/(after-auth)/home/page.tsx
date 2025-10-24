import { SignOutButton } from "@/components/sign-out-button";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Manage your account and settings.
          </p>
        </div>

        {/* User Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your account details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Name:
                </span>
                <span className="col-span-2 text-sm">
                  {user.name || "Not set"}
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Email:
                </span>
                <span className="col-span-2 text-sm">{user.email}</span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  User ID:
                </span>
                <span className="col-span-2 font-mono text-xs">{user.id}</span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Email Verified:
                </span>
                <span className="col-span-2 text-sm">
                  {user.emailVerified ? (
                    <span className="text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">
                      ⚠ Not verified
                    </span>
                  )}
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Account Created:
                </span>
                <span className="col-span-2 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>
              Information about your current session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Session ID:
                </span>
                <span className="col-span-2 font-mono text-xs">
                  {session.session.id}
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Expires At:
                </span>
                <span className="col-span-2 text-sm">
                  {new Date(session.session.expiresAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your session and account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <SignOutButton variant="outline" className="flex-1" />
              <DeleteAccountButton variant="destructive" className="flex-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
