"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 mt-8 md:mt-0">
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onTabChange(tab)}
          variant={activeTab === tab ? "default" : "ghost"}
          size="sm"
          className={`rounded-full px-5 text-sm font-medium transition-all ${
            activeTab !== tab
              ? "text-muted-foreground hover:text-foreground"
              : ""
          }`}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
