import React, { useState } from "react";
import {
  Copy,
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Tag,
  TicketPercent,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CouponWidgetProps {
  name: string;
  code: string;
  discountAmount: string;
  target: string;
  expiryDate: string;
  serial: string;
  status: "active" | "inactive" | "expired";
  stats: {
    claims: number;
    revenue: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CouponWidget = ({
  name = "Summer Sale",
  code = "SUMMER2025",
  discountAmount = "25%",
  target = "Entire Store",
  expiryDate = "2025-12-31",
  serial,
  status = "active",
  stats = { claims: 120, revenue: "$4,500" },
  onEdit,
  onDelete,
}: CouponWidgetProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = {
    active: "text-green-700 border-green-200",
    inactive: "text-primary border-primary border",
    expired: "text-destructive border-destructive border",
  };

  return (
    <Card className="w-full max-w-md overflow-hidden shadow-sm transition-all hover:shadow-md p-0 ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 py-4 pb-2">
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Serial: {serial || Math.floor(Math.random() * 10 ** 6)}
          </span>
          <h3 className="font-semibold text-foreground leading-none tracking-tight">
            {name}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="px-5 py-4 space-y-4">
        <div className="relative group flex items-center justify-between rounded-xl border border-dashed border-border bg-muted/50 p-3 pr-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TicketPercent className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Code
              </span>
              <span className="font-mono text-lg font-bold tracking-wider text-foreground">
                {code}
              </span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className={cn(
              "h-9 w-9 transition-colors",
              copied
                ? "text-sucess bg-green-100 hover:bg-green-200"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span>
              <span className="font-medium text-foreground">
                {discountAmount}
              </span>{" "}
              on {target}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">Exp: {expiryDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <div className="grid w-full grid-cols-3 gap-4 divide-x bg-muted/40 px-2 py-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase">
              Status
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "h-5 px-2 rounded-full text-[10px] font-semibold",
                statusColor[status],
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <Users className="h-3 w-3" /> Claims
            </span>
            <span className="font-bold text-sm">{stats.claims}</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Rev
            </span>
            <span className="font-bold text-sm">{stats.revenue}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
