import { Switch } from "@/components/animate-ui/components/radix/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  Check,
  Download,
  Globe,
  Image as ImageIcon,
  LayoutTemplate,
  Mail,
  Save,
  Store,
  Trash,
  Trash2,
  Undo2,
  Upload,
  VenetianMask,
} from "lucide-react";
import { Streamdown } from "streamdown";

export type StoreSettings = {
  storeName: string;
  description: string;
  storeUrl: string;
  supportEmail: string;
  contactEmail: string;
};

export function SettingsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Customize how your store appears to the public on FuelDev.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Branding Section */}
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-col gap-4 shrink-0">
              <div className="space-y-1">
                <Label>Store Logo</Label>
                <span className="text-[0.8rem] text-muted-foreground block">
                  Recommended 400x400px
                </span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="group relative flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 transition-all hover:bg-muted/50 hover:border-primary/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Upload
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="h-8 w-8"
                        >
                          <LayoutTemplate className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Select preset</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove logo</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <Store className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="store-name"
                    placeholder="e.g. ACME's Digital Assets"
                  />
                </InputGroup>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="store-desc">Description</Label>
                  <span className="text-xs text-muted-foreground">0/250</span>
                </div>
                <Textarea
                  id="store-desc"
                  placeholder="Briefly describe what you build or sell..."
                  className="min-h-[120px] resize-none"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  This will be displayed on your profile header and search
                  results.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Configuration Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-handle">Store URL</Label>
              <InputGroup>
                <InputGroupAddon className="">
                  <Globe />
                  fueldev.com/
                </InputGroupAddon>
                <InputGroupInput id="store-handle" placeholder="your-brand" />
                <InputGroupAddon align={"inline-end"}>
                  <Check className="text-green-500" />
                </InputGroupAddon>
              </InputGroup>
              <p className="text-[0.8rem] text-muted-foreground">
                Unique handle for your store. Changes are limited to once every
                60 days.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-email">Support Email</Label>
              <InputGroup>
                <InputGroupAddon>
                  <Mail className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="store-email"
                  type="email"
                  placeholder="contact@example.com"
                />
                <InputGroupAddon align={"inline-end"}>
                  <Check className="text-green-500" />
                </InputGroupAddon>
              </InputGroup>
              <p className="text-[0.8rem] text-muted-foreground">
                Visible to customers for support inquiries and invoices.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-start justify-between">
            <div className="">
              <Label>Contact email to display</Label>
              <p className="text-muted-foreground text-sm mt-1">
                Choose which email buyers see in delivery messages and receipts.
              </p>
            </div>
            <Select defaultValue="primary">
              <SelectTrigger>
                <SelectValue placeholder="Select an email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary email</SelectItem>
                <SelectItem value="secondary">Secondary email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Category Access</CardTitle>
          <CardDescription>
            Define access and visibility settings for each category. Products in
            this category inherit these rules, including early release for
            members.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="members">Members First</SelectItem>
                  <SelectItem value="digital">Digital Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Create
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <Label htmlFor="early-access">Early release for members</Label>
              <p className="text-muted-foreground mt-1 text-sm">
                Let members view products before they become visible to
                everyone.
              </p>
            </div>
            <Switch id="early-access" />
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Legal and Policy</CardTitle>
          <CardDescription>lorem ipsum something something</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full h-64 bg-muted border rounded-xl p-2">
            <Streamdown># Hello world</Streamdown>
          </ScrollArea>

          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              Generated at: 20 Jun 2025, 12:30
            </p>
            <div className="mt-2 flex items-center gap-2 justify-end">
              <Button size={"sm"} variant={"outline"}>
                <Download /> Download a copy
              </Button>
              <Button size={"sm"} variant={"outline"}>
                <Mail /> Send me a copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardContent className="flex items-center justify-end gap-2">
          <Button size={"sm"} variant={"ghost"} disabled>
            <Undo2 /> Revert Changes
          </Button>
          <Button size={"sm"} disabled>
            <Save /> Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-5 border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Actions in this section permanently affect your store. You can
            disable the store or delete it along with all associated data.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="disable-store"
                  className="text-base font-medium"
                >
                  Disable Store
                </Label>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Temporarily disable your public storefront. You can still access
                settings, but customers will not be able to view your store
                until you enable it again.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                id="delete-store"
                size={"sm"}
                className="border border-destructive/50 bg-destructive/10 hover:bg-destructive/20 text-foreground"
              >
                <VenetianMask />
                Disable Store
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-destructive/5 md:flex-row md:items-start md:justify-between rounded-xl">
            <div className="space-y-1">
              <Label
                htmlFor="delete-store"
                className="text-base font-medium text-destructive"
              >
                Delete Store
              </Label>
              <p className="text-sm text-muted-foreground max-w-md">
                This action cannot be undone. All store data will be removed
                permanently.
              </p>
            </div>
            <Button variant="destructive" id="delete-store" size={"sm"}>
              <Trash2 />
              Delete Store
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
