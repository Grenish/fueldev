"use client";

import React from "react";
import { Plus, Percent, Copy, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export interface Discount {
  code: string;
  type: string;
  value: string;
  uses: number;
  status: "active" | "expired" | "scheduled";
}

interface DiscountsTabProps {
  discounts?: Discount[];
  onCreateDiscount?: () => void;
  onCopyCode?: (code: string) => void;
  onDiscountClick?: (discount: Discount) => void;
}

const defaultDiscounts: Discount[] = [
  {
    code: "WELCOME20",
    type: "Percentage",
    value: "20%",
    uses: 45,
    status: "active",
  },
  {
    code: "BLACKFRIDAY",
    type: "Fixed Amount",
    value: "$10.00",
    uses: 120,
    status: "expired",
  },
  {
    code: "SUMMER_SALE",
    type: "Percentage",
    value: "15%",
    uses: 12,
    status: "active",
  },
];

export function DiscountsTab({
  discounts = defaultDiscounts,
  onCreateDiscount,
  onCopyCode,
  onDiscountClick,
}: DiscountsTabProps) {
  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopyCode) {
      onCopyCode(code);
    } else {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Active Coupons</h2>
        <Button
          className={`${discounts.length === 0 ? "hidden" : "block"}`}
          onClick={onCreateDiscount}
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((discount, i) => (
          <div
            key={i}
            className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md cursor-pointer"
            onClick={() => onDiscountClick?.(discount)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-lg tracking-tight">
                    {discount.code}
                  </h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {discount.type}
                  </p>
                </div>
              </div>
              <Badge
                variant={discount.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {discount.status}
              </Badge>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">{discount.value}</p>
                <p className="text-xs text-muted-foreground">
                  {discount.uses} times used
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleCopyCode(discount.code, e)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {discounts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Percent className="text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Not Discount</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any discount code yet.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>Create Coupon</Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
}
