"use client";

import React from "react";
import { CreateNewSection } from "./create-new-section";
import { InventorySection } from "./inventory-section";

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

interface ProductsTabProps {
  products?: Product[];
  storeName: string;
  onProductClick?: (product: Product) => void;
  onFilterClick?: () => void;
}

export function ProductsTab({
  products,
  storeName,
  onProductClick,
  onFilterClick,
}: ProductsTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CreateNewSection storeName={storeName} />
      <InventorySection
        products={products}
        onProductClick={onProductClick}
        onFilterClick={onFilterClick}
      />
    </div>
  );
}
