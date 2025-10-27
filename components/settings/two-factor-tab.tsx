"use client";

import { Shield, Smartphone, Key, QrCode, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface TwoFactorTabProps {
  twoFactorEnabled: boolean;
}

export function TwoFactorTab({ twoFactorEnabled }: TwoFactorTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* 2FA Status */}
      {!twoFactorEnabled && (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">
            Enhance Your Account Security
          </AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Enable two-factor authentication to add an extra layer of security
            to your account. This helps protect your account from unauthorized
            access.
          </AlertDescription>
        </Alert>
      )}

      {/* Authenticator App */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Authenticator App</CardTitle>
            </div>
            {twoFactorEnabled && (
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                Enabled
              </Badge>
            )}
          </div>
          <CardDescription>
            Use an authenticator app to generate one-time codes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold">
                    Set Up Authenticator App
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Scan a QR code with apps like Google Authenticator, Authy,
                    or 1Password to generate time-based one-time passwords
                    (TOTP).
                  </p>
                  <div className="pt-2">
                    <Button>Enable 2FA</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  How it works
                </h5>
                <ol className="text-sm text-muted-foreground space-y-1.5 ml-6 list-decimal">
                  <li>Download an authenticator app on your mobile device</li>
                  <li>Scan the QR code or enter the setup key manually</li>
                  <li>Enter the 6-digit code from the app to verify</li>
                  <li>Save your recovery codes in a safe place</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    Two-Factor Authentication
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Configured on December 1, 2024
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Reconfigure
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Backup Codes</div>
                  <div className="text-sm text-muted-foreground">
                    8 backup codes remaining
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Codes
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-destructive">
                    Disable 2FA
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Turn off two-factor authentication
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Disable
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <CardTitle>SMS Authentication</CardTitle>
          </div>
          <CardDescription>
            Receive one-time codes via text message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-muted">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-medium">Phone Number Verification</h4>
              <p className="text-sm text-muted-foreground">
                Add a phone number to receive authentication codes via SMS as a
                backup method.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Phone Number</div>
              <div className="text-sm text-muted-foreground">
                No phone number added
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add Number
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Codes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Recovery Codes</CardTitle>
          </div>
          <CardDescription>
            Use recovery codes when you can&apos;t access your 2FA device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950/20">
              <Key className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-medium">Backup Recovery Codes</h4>
              <p className="text-sm text-muted-foreground">
                Generate one-time use recovery codes to access your account if
                you lose your 2FA device. Store these codes in a secure
                location.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">
                {twoFactorEnabled ? "Regenerate Codes" : "Generate Codes"}
              </div>
              <div className="text-sm text-muted-foreground">
                {twoFactorEnabled
                  ? "Create a new set of recovery codes"
                  : "Available after enabling 2FA"}
              </div>
            </div>
            <Button variant="outline" size="sm" disabled={!twoFactorEnabled}>
              {twoFactorEnabled ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Security Keys</CardTitle>
          </div>
          <CardDescription>
            Use hardware security keys for enhanced protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-muted">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-medium">Hardware Security Keys</h4>
              <p className="text-sm text-muted-foreground">
                Add a physical security key (like YubiKey) for the strongest
                form of two-factor authentication using WebAuthn/FIDO2.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Registered Keys</div>
              <div className="text-sm text-muted-foreground">
                No security keys registered
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
