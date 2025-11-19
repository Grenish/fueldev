"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: "paid" | "pending" | "failed";
  date: string;
}

interface OrdersTabProps {
  orders?: Order[];
  onExportClick?: () => void;
  onOrderClick?: (order: Order) => void;
}

const defaultOrders: Order[] = [
  {
    id: "#3022",
    customer: "Alex Morgan",
    email: "alex@example.com",
    total: "$49.00",
    status: "paid",
    date: "2 mins ago",
  },
  {
    id: "#3021",
    customer: "Sarah Chen",
    email: "sarah@design.co",
    total: "$120.00",
    status: "paid",
    date: "1 hour ago",
  },
  {
    id: "#3020",
    customer: "Mike Ross",
    email: "mike@pearson.com",
    total: "$49.00",
    status: "failed",
    date: "3 hours ago",
  },
  {
    id: "#3019",
    customer: "Jessica Pearson",
    email: "jessica@firm.com",
    total: "$299.00",
    status: "pending",
    date: "5 hours ago",
  },
];

export function OrdersTab({
  orders = defaultOrders,
  onExportClick,
  onOrderClick,
}: OrdersTabProps) {
  const getStatusStyles = (status: Order["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "failed":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "failed":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Orders</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportClick}
          className={`${orders.length === 0 ? "hidden" : "block"}`}
        >
          Export CSV
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {orders.map((order, i) => (
          <div
            key={order.id}
            className={`flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer ${
              i !== orders.length - 1 ? "border-b border-border" : ""
            }`}
            onClick={() => onOrderClick?.(order)}
          >
            <div className="flex items-center gap-4">
              {/* Avatar Placeholder */}
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                {getInitials(order.customer)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {order.customer}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {order.id}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{order.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 md:mt-0 pl-14 md:pl-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                <Clock className="h-3.5 w-3.5" />
                {order.date}
              </div>

              <Badge
                variant="secondary"
                className={`capitalize border-transparent ${getStatusStyles(
                  order.status,
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>

              <span className="font-semibold text-foreground min-w-[80px] text-right">
                {order.total}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Package className="text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Not Found</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t made any sales yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
}
