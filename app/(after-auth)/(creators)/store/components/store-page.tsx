"use client";

import React, { useState } from "react";
import { StoreHeader } from "./store-header";
import { TabNavigation } from "./tab-navigation";
import { ProductsTab } from "./products-tab";
import { OrdersTab, type Order } from "./orders-tab";
import { DiscountsTab, type Discount } from "./discounts-tab";
import { SettingsTab, type StoreSettings } from "./settings-tab";

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

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState("Products");

  // Updated tabs list
  const tabs = ["Products", "Orders", "Discounts", "Settings"];

  // Store information
  const storeInfo = {
    storeName: "Acme Store",
    storeUrl: "fueldev.com/store/acmestore",
    description:
      "Welcome to Acme Store! We offer a curated selection of digital assets and physical goods, designed to empower creators and innovators.",
  };

  // Mock products data
  const products = [
    {
      id: "1",
      name: "Dark Mode UI Kit",
      price: "$49.00",
      sales: 24,
      revenue: "$1,176.00",
      type: "Digital",
      isHighPerforming: true,
    },
  ];

  // Mock orders data
  const orders: Order[] = [
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

  // Mock discounts data
  const discounts: Discount[] = [
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

  // Mock settings data
  const settings: StoreSettings = {
    storeName: "Acme Store",
    storeUrl: "acmestore",
    description:
      "Welcome to Acme Store! We offer a curated selection of digital assets and physical goods, designed to empower creators and innovators.",
    currency: "USD ($)",
    maintenanceMode: false,
  };

  // Event handlers
  const handleEditDescription = () => {
    alert("Edit Store Description");
  };

  const handleCreateProduct = (type: string) => {
    console.log("Create product of type:", type);
  };

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product);
  };

  const handleFilterClick = () => {
    console.log("Filter clicked");
  };

  const handleExportOrders = () => {
    console.log("Export orders to CSV");
  };

  const handleOrderClick = (order: Order) => {
    console.log("Order clicked:", order);
  };

  const handleCreateDiscount = () => {
    console.log("Create new discount");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    console.log("Copied code:", code);
  };

  const handleDiscountClick = (discount: Discount) => {
    console.log("Discount clicked:", discount);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    console.log("Save settings:", newSettings);
  };

  const handleDiscardSettings = () => {
    console.log("Discard settings changes");
  };

  const handleDeleteStore = () => {
    if (
      confirm(
        "Are you sure you want to delete your store? This action cannot be undone.",
      )
    ) {
      console.log("Delete store");
    }
  };

  return (
    <div className="min-h-screen w-full text-foreground selection:bg-primary/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <StoreHeader
            storeName={storeInfo.storeName}
            storeUrl={storeInfo.storeUrl}
            description={storeInfo.description}
            onEditDescription={handleEditDescription}
          />

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === "Products" && (
          <ProductsTab
            products={products}
            onCreateProduct={handleCreateProduct}
            onProductClick={handleProductClick}
            onFilterClick={handleFilterClick}
          />
        )}

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

        {activeTab === "Settings" && (
          <SettingsTab
            settings={settings}
            onSave={handleSaveSettings}
            onDiscard={handleDiscardSettings}
            onDelete={handleDeleteStore}
          />
        )}
      </div>
    </div>
  );
}
