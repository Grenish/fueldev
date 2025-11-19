"use client";

import React from "react";
import Image from "next/image";
import { Mountain } from "lucide-react";

interface StoreHeaderProps {
  storeName: string;
  storeUrl?: string | null;
  description: string;
  storeLogo?: string | null;
}

export function StoreHeader({
  storeName,
  storeUrl,
  description,
  storeLogo,
}: StoreHeaderProps) {
  return (
    <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          {storeLogo ? (
            <Image
              src={storeLogo}
              alt={`${storeName} logo`}
              width={80}
              height={80}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <Mountain className="h-8 w-8 text-primary" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {storeName}
            </h2>
            {storeUrl && (
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hover:text-primary cursor-pointer transition-colors">
                  {storeUrl}
                </span>
              </div>
            )}
          </div>

          <div className="group relative max-w-2xl rounded-xl border border-transparent bg-secondary/30 p-4 transition-all hover:border-border hover:bg-secondary/50">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
