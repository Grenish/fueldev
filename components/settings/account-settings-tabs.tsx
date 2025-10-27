"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Monitor, Smartphone, Link2 } from "lucide-react";
import { AccountTab } from "./account-tab";
import { SecurityTab } from "./security-tab";
import { SessionsTab } from "./sessions-tab";
import { TwoFactorTab } from "./two-factor-tab";
import { ConnectedAppsTab } from "./connected-apps-tab";

interface AccountSettingsTabsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    image?: string | null;
  };
  currentSession: {
    id: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    expiresAt: Date;
  };
  hasPassword: boolean;
  connectedAccounts: Array<{
    id: string;
    providerId: string;
    accountId: string;
    createdAt: Date;
  }>;
}

export function AccountSettingsTabs({
  user,
  currentSession,
  hasPassword,
  connectedAccounts,
}: AccountSettingsTabsProps) {
  // Mock 2FA status (in real app, fetch from database)
  const twoFactorEnabled = false;

  return (
    <Tabs defaultValue="account" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-muted/50 p-1.5">
        <TabsTrigger
          value="account"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Account</span>
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger
          value="sessions"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Monitor className="h-4 w-4" />
          <span className="hidden sm:inline">Sessions</span>
        </TabsTrigger>
        <TabsTrigger
          value="2fa"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Smartphone className="h-4 w-4" />
          <span className="hidden sm:inline">2FA</span>
        </TabsTrigger>
        <TabsTrigger
          value="apps"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">Connected Apps</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="mt-6">
        <AccountTab user={user} />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecurityTab hasPassword={hasPassword} />
      </TabsContent>

      <TabsContent value="sessions" className="mt-6">
        <SessionsTab currentSession={currentSession} />
      </TabsContent>

      <TabsContent value="2fa" className="mt-6">
        <TwoFactorTab twoFactorEnabled={twoFactorEnabled} />
      </TabsContent>

      <TabsContent value="apps" className="mt-6">
        <ConnectedAppsTab accounts={connectedAccounts} />
      </TabsContent>
    </Tabs>
  );
}
