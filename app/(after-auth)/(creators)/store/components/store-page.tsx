"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/react";
import { slugifyStoreName } from "@/lib/utils";
import { StoreHeader } from "./store-header";
import { TabNavigation } from "./tab-navigation";
import { ProductsTab } from "./products-tab";
import { OrdersTab, type Order } from "./orders-tab";
import { DiscountsTab, type Discount } from "./discounts-tab";
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
  const { data: myStores, isLoading } = trpc.store.getMyStores.useQuery();

  // Find the store that matches the slug
  const store = React.useMemo(() => {
    const matchedStore =
      storeSlug && myStores
        ? myStores.find((s) => slugifyStoreName(s.storeName) === storeSlug)
        : myStores?.[0];

    return matchedStore;
  }, [storeSlug, myStores]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-semibold">Store not found</p>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find a store linked to this URL. Create one to get
          started.
        </p>
      </div>
    );
  }

  // Mock products data
  const products: Product[] = [];

  // Mock orders data
  const orders: Order[] = [];

  // Mock discounts data
  const discounts: Discount[] = [];

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
          <DiscountsTab
            discounts={discounts}
            onCreateDiscount={handleCreateDiscount}
            onCopyCode={handleCopyCode}
            onDiscountClick={handleDiscountClick}
          />
        )}

        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
}
