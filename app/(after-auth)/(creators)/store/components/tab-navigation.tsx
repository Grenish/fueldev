"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <>
      <div className="md:hidden w-full relative">
        <Select value={activeTab} onValueChange={onTabChange}>
          <SelectTrigger className="h-10 w-full rounded-full border border-input bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
            <SelectValue placeholder="Choose a tab" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-border bg-popover">
            {tabs.map((tab) => (
              <SelectItem key={tab} value={tab} className="text-sm">
                {tab}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* DESKTOP VIEW: Button Group
          Your original implementation.
          Visible only on medium screens and up (md:flex).
      */}
      <div className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card p-1 mt-8 md:mt-0 overflow-auto">
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
    </>
  );
}
