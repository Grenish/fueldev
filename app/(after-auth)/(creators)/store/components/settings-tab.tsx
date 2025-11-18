"use client";

import React, { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/animate-ui/components/radix/switch";

export interface StoreSettings {
  storeName: string;
  storeUrl: string;
  description: string;
  currency: string;
  maintenanceMode: boolean;
}

interface SettingsTabProps {
  settings?: StoreSettings;
  onSave?: (settings: StoreSettings) => void;
  onDiscard?: () => void;
  onDelete?: () => void;
}

const defaultSettings: StoreSettings = {
  storeName: "Acme Store",
  storeUrl: "acmestore",
  description: "",
  currency: "USD ($)",
  maintenanceMode: false,
};

export function SettingsTab({
  settings = defaultSettings,
  onSave,
  onDiscard,
  onDelete,
}: SettingsTabProps) {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setHasChanges(false);
  };

  const handleDiscard = () => {
    setFormData(settings);
    setHasChanges(false);
    if (onDiscard) {
      onDiscard();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Section: Store Details */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Store Details</h3>
            <p className="text-sm text-muted-foreground">
              Manage your public store profile.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) =>
                  handleInputChange("storeName", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeUrl">Store URL</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  fueldev.com/store/
                </span>
                <Input
                  id="storeUrl"
                  value={formData.storeUrl}
                  onChange={(e) => handleInputChange("storeUrl", e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <textarea
                id="desc"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about your store..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* Section: Preferences */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Preferences</h3>
            <p className="text-sm text-muted-foreground">
              Currency and regional settings.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Store Currency</Label>
                <p className="text-sm text-muted-foreground">
                  All products will be priced in {formData.currency.split(" ")[0]}.
                </p>
              </div>
              <Badge variant="outline">{formData.currency}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Hide your store from the public.
                </p>
              </div>
              <Switch
                checked={formData.maintenanceMode}
                onCheckedChange={(checked) =>
                  handleInputChange("maintenanceMode", checked)
                }
              />
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            variant="ghost"
            onClick={handleDiscard}
            disabled={!hasChanges}
          >
            Discard
          </Button>
          <Button
            className="gap-2"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="pt-10">
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50 p-6 flex items-center justify-between">
            <div>
              <h4 className="text-red-600 dark:text-red-400 font-medium">
                Delete Store
              </h4>
              <p className="text-red-600/80 dark:text-red-400/70 text-sm">
                Permanently delete your store and all data.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
