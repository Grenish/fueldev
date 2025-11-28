"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/react";
import { slugifyStoreName } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Store } from "lucide-react";
import { StoreHeader } from "./store-header";
import { TabNavigation } from "./tab-navigation";
import { ProductsTab } from "./products-tab";
import { OrdersTab, type Order } from "./orders-tab";
import { DiscountsTab } from "./discounts-tab";
import { SettingsTab } from "./settings-tab";
import { OverviewTab } from "./overview-tab";

interface Product {
  id: string;
  name: string;
  price: string;
  sales: number;
  revenue: string;
  type: string;
  imageUrl?: string;
  isHighPerforming?: boolean;
}

interface StorePageProps {
  storeSlug?: string;
}

export default function StorePage({ storeSlug }: StorePageProps) {
  const [activeTab, setActiveTab] = useState("Products");

  // Updated tabs list
  const tabs = ["Products", "Overview", "Orders", "Discounts", "Settings"];

  // Fetch all stores to match by slug
  const {
    data: myStores,
    isLoading,
    isRefetching,
  } = trpc.store.getMyStores.useQuery();

  // Find the store that matches the slug
  const store = React.useMemo(() => {
    const matchedStore =
      storeSlug && myStores
        ? myStores.find((s) => slugifyStoreName(s.storeName) === storeSlug)
        : myStores?.[0];

    return matchedStore;
  }, [storeSlug, myStores]);

  if (isLoading || (!store && isRefetching)) {
    return (
      <div className="min-h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-6" />
          <p className="text-sm text-muted-foreground">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-full w-full flex items-center justify-center">
        <Empty>
          <EmptyMedia variant="icon">
            <Store />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Store not found</EmptyTitle>
            <EmptyDescription>
              We couldn&apos;t find a store linked to this URL. Create one to
              get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  // Mock products data
  const products: Product[] = [];

  // Mock orders data
  const orders: Order[] = [];


  const handleProductClick = () => {
    // TODO: Implement product details navigation
  };

  const handleFilterClick = () => {
    // TODO: Implement filtering
  };

  const handleExportOrders = () => {
    // TODO: Implement CSV export
  };

  const handleOrderClick = () => {
    // TODO: Implement order details navigation
  };

  const handleCreateDiscount = () => {
    // TODO: Implement discount creation
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDiscountClick = () => {
    // TODO: Implement discount details/editing
  };

  return (
    <div className="min-h-screen w-full text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <StoreHeader
            storeName={store?.storeName || ""}
            storeUrl={
              store
                ? `fueldev.com/store/${slugifyStoreName(store.storeName)}`
                : null
            }
            description={store?.description || ""}
            storeLogo={store?.storeLogo}
          />

          <div className="w-full md:w-auto">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {activeTab === "Products" && (
          <ProductsTab
            products={products}
            storeName={store?.storeName || ""}
            onProductClick={handleProductClick}
            onFilterClick={handleFilterClick}
          />
        )}

        {activeTab === "Overview" && <OverviewTab />}

        {activeTab === "Orders" && (
          <OrdersTab
            orders={orders}
            onExportClick={handleExportOrders}
            onOrderClick={handleOrderClick}
          />
        )}

        {activeTab === "Discounts" && (
          <DiscountsTab storeId={store?.id} />
        )}

        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
}
