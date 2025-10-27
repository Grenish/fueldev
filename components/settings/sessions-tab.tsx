"use client";

import { Monitor, Smartphone, Globe, Clock, MapPin } from "lucide-react";
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

interface SessionTabProps {
  currentSession: {
    id: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    expiresAt: Date;
  };
}

export function SessionsTab({ currentSession }: SessionTabProps) {
  // Parse user agent to get device info
  const getDeviceInfo = (userAgent?: string | null) => {
    if (!userAgent) return { type: "Unknown", name: "Unknown Device" };

    if (userAgent.includes("Mobile") || userAgent.includes("Android")) {
      return { type: "Mobile", name: "Mobile Device", icon: Smartphone };
    }
    if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
      return { type: "Tablet", name: "Tablet Device", icon: Smartphone };
    }
    return { type: "Desktop", name: "Desktop Browser", icon: Monitor };
  };

  const deviceInfo = getDeviceInfo(currentSession.userAgent);
  const DeviceIcon = deviceInfo.icon;

  // Mock data for other sessions (in real app, fetch from API)
  const otherSessions = [
    {
      id: "session-2",
      device: "Chrome on Windows",
      location: "San Francisco, CA",
      ipAddress: "192.168.1.100",
      lastActive: "2 hours ago",
      icon: Monitor,
    },
    {
      id: "session-3",
      device: "Safari on iPhone",
      location: "New York, NY",
      ipAddress: "10.0.0.50",
      lastActive: "1 day ago",
      icon: Smartphone,
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
      {/* Current Session */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Current Session</CardTitle>
          </div>
          <CardDescription>
            Your active session on this device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              {DeviceIcon && <DeviceIcon className="h-6 w-6 text-primary" />}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">{deviceInfo.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {deviceInfo.type}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                  Active Now
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>IP: {currentSession.ipAddress || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Started:{" "}
                    {new Date(currentSession.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Session ID
                </label>
                <p className="font-mono text-xs bg-muted/50 p-2 rounded-md break-all">
                  {"••••••" + currentSession.id.slice(-12)}
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Session Expires</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(currentSession.expiresAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Other Sessions</CardTitle>
              <CardDescription>
                Manage sessions on other devices
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Revoke All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {otherSessions.length > 0 ? (
            otherSessions.map((session, index) => (
              <div key={session.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-muted">
                    <session.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{session.device}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Last active {session.lastActive}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Revoke
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {session.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        {session.ipAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No other active sessions
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Session Preferences</CardTitle>
          <CardDescription>
            Configure how sessions work for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Remember Device</div>
              <div className="text-sm text-muted-foreground">
                Stay logged in on trusted devices for 30 days
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Session Timeout</div>
              <div className="text-sm text-muted-foreground">
                Automatically sign out after 15 minutes of inactivity
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
