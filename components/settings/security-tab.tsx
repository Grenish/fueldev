"use client";

import { Shield, Key, Lock, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SignOutButton } from "@/components/sign-out-button";
import { DeleteAccountButton } from "@/components/delete-account-button";

interface SecurityTabProps {
  hasPassword: boolean;
}

export function SecurityTab({ hasPassword }: SecurityTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Password Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>
            Manage your password and authentication credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Current Password</div>
              <div className="text-sm text-muted-foreground">
                {hasPassword
                  ? "Last changed on January 15, 2024"
                  : "No password set. Using social login."}
              </div>
            </div>
            <Button variant="outline" size="sm">
              {hasPassword ? "Change Password" : "Set Password"}
            </Button>
          </div>

          {hasPassword && (
            <>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Password Strength</div>
                  <div className="text-sm text-muted-foreground">
                    Your password is strong
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded-md">
                  <Lock className="h-3 w-3" />
                  Strong
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account Recovery */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Account Recovery</CardTitle>
          </div>
          <CardDescription>
            Options to recover your account if you lose access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Recovery Email</div>
              <div className="text-sm text-muted-foreground">
                Used to recover your account
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add Email
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Recovery Codes</div>
              <div className="text-sm text-muted-foreground">
                Generate backup codes for account recovery
              </div>
            </div>
            <Button variant="outline" size="sm">
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>
            Get notified about important security events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Login Alerts</div>
              <div className="text-sm text-muted-foreground">
                Get notified when someone logs into your account
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Unusual Activity</div>
              <div className="text-sm text-muted-foreground">
                Alert me about suspicious account activity
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sign out from your current session
              </p>
            </div>
            <SignOutButton variant="outline" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
            <div>
              <h4 className="text-sm font-medium text-destructive">
                Delete Account
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <DeleteAccountButton variant="destructive" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
