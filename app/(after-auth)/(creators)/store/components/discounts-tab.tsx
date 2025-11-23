import { Plus, Percent, Copy, MoreHorizontal } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponManagementCard } from "@/components/coupon-card-new";
import { CouponWidget } from "@/components/coupon-widget";
import { CouponCard } from "@/components/coupon-card";

export function DiscountsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/*<Empty>
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
      </Empty>*/}

      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Create Discount
        </h2>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <CouponWidget
            name="Black Friday Bundle"
            code="BF2025"
            discountAmount="50% OFF"
            target="Bundles"
            expiryDate="Nov 30, 2025"
            serial="8839-1120"
            status="active"
            stats={{ claims: 1240, revenue: "$12.5k" }}
          />

          <CouponWidget
            name="Influencer Promo"
            code="JAKE10"
            discountAmount="$10"
            target="Accessories"
            expiryDate="Dec 31, 2025"
            serial="1102-3341"
            status="inactive"
            stats={{ claims: 5, revenue: "$50" }}
          />
          <CouponWidget
            name="Influencer Promo"
            code="JAKE10"
            discountAmount="$10"
            target="Accessories"
            expiryDate="Dec 31, 2025"
            serial="1102-3341"
            status="expired"
            stats={{ claims: 5, revenue: "$50" }}
          />

          {/*<CouponCard
            name="Summer Sale 2025"
            code="SUMMER25"
            discountFor="Swimwear Category"
            expiryDate="August 31, 2025"
            serialNumber="8821-9940-1120"
            stats={{
              claims: 142,
              revenue: "$4,250",
              status: "active",
            }}
            onEdit={() => console.log("Edit clicked")}
            onDelete={() => console.log("Delete clicked")}
          />
          <CouponCard
            name="VIP Exclusive"
            code="VIP-9921"
            discountFor="All Items"
            expiryDate="Dec 31, 2025"
            serialNumber="1102-3344-5566"
            stats={{
              claims: 12,
              revenue: "$890",
              status: "suspended",
            }}
          />*/}
        </div>
      </div>
    </div>
  );
}
