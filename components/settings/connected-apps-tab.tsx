"use client";

import {
  Link2,
  Github,
  Chrome,
  Unlink,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Account {
  id: string;
  providerId: string;
  accountId: string;
  createdAt: Date;
}

interface ConnectedAppsTabProps {
  accounts: Account[];
}

export function ConnectedAppsTab({ accounts }: ConnectedAppsTabProps) {
  // Map provider IDs to display information
  const getProviderInfo = (providerId: string) => {
    const providers: Record<
      string,
      {
        name: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
      }
    > = {
      github: {
        name: "GitHub",
        icon: Github,
        color: "bg-gray-900 dark:bg-gray-100",
      },
      google: { name: "Google", icon: Chrome, color: "bg-blue-500" },
      discord: { name: "Discord", icon: Link2, color: "bg-indigo-500" },
    };
    return (
      providers[providerId] || {
        name: providerId,
        icon: Link2,
        color: "bg-muted",
      }
    );
  };

  const connectedProviders = accounts.map((acc) => acc.providerId);

  const availableProviders = [
    {
      id: "github",
      name: "GitHub",
      description: "Connect your GitHub account for seamless integration",
    },
    {
      id: "google",
      name: "Google",
      description: "Sign in with your Google account",
    },
    {
      id: "discord",
      name: "Discord",
      description: "Connect your Discord account",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Connected Accounts</CardTitle>
          </div>
          <CardDescription>
            Manage your linked social and OAuth accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.length > 0 ? (
            accounts.map((account, index) => {
              const provider = getProviderInfo(account.providerId);
              const ProviderIcon = provider.icon;

              return (
                <div key={account.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${provider.color} text-white`}
                    >
                      <ProviderIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            {provider.name}
                            <Badge
                              variant="secondary"
                              className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Account ID: {account.accountId.slice(0, 20)}...
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          Disconnect
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Connected on{" "}
                        {new Date(account.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No accounts connected yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Connect additional accounts to enhance your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableProviders.map((provider, index) => {
            const isConnected = connectedProviders.includes(provider.id);
            const providerInfo = getProviderInfo(provider.id);
            const ProviderIcon = providerInfo.icon;

            return (
              <div key={provider.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${providerInfo.color} text-white`}
                    >
                      <ProviderIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{provider.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isConnected ? "outline" : "default"}
                    size="sm"
                    disabled={isConnected}
                  >
                    {isConnected ? "Connected" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Permissions & Access */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions & Access</CardTitle>
          <CardDescription>
            Manage what connected apps can access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Profile Information</div>
              <div className="text-sm text-muted-foreground">
                Allow apps to access your basic profile information
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Email Access</div>
              <div className="text-sm text-muted-foreground">
                Grant apps permission to read your email address
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">API Access</div>
              <div className="text-sm text-muted-foreground">
                Manage third-party API access to your account
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authorized Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Authorized Applications</CardTitle>
          <CardDescription>
            Third-party apps with access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            No authorized applications
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
