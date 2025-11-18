"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Package,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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

interface InventorySectionProps {
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onFilterClick?: () => void;
}

const defaultProducts: Product[] = [
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

export function InventorySection({
  products = defaultProducts,
  onProductClick,
  onFilterClick,
}: InventorySectionProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Inventory</h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="w-64 pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-background"
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </Button>
          <Separator orientation="vertical" className="h-8 mx-1" />
          <div className="flex rounded-lg border border-border bg-background p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent/50 hover:border-primary/30 cursor-pointer"
            onClick={() => onProductClick?.(product)}
          >
            <div className="flex items-center gap-5">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-secondary">
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/5" />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 opacity-20" />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">
                    {product.name}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-primary/10 text-primary border-transparent"
                  >
                    {product.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>{product.price}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{product.sales} Sales</span>
                  {product.isHighPerforming && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Sparkles className="h-3 w-3" /> High performing
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pr-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">
                  {product.revenue}
                </p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-sm text-muted-foreground">
              No products found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
