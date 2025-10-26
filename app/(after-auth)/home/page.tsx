"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProtectedHomePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const periodLabels: Record<string, string> = {
    "7": "Last 7 days",
    "30": "Last 30 days",
    all: "All time",
  };
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="w-full md:w-1/2 bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src="/avatar-placeholder.png" alt="Profile" />
              <AvatarFallback>GR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Hi, Grenish
              </h2>
              <p className="text-sm text-muted-foreground">
                fueldev.in/grenish
              </p>
            </div>
          </div>

          <Link
            href="#"
            className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:bg-primary/90 transition inline-flex items-center gap-1.5"
          >
            <SquareArrowOutUpRight size={20} /> Share page
          </Link>
        </div>

        <Separator className="my-5" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">Earnings</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-[140px]">
                  {periodLabels[selectedPeriod]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedPeriod("7")}>
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("30")}>
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("all")}>
                  All time
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-3xl font-bold">&#8377;0</p>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              &#8377;0 Supporters
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-rose-400"></span>
              &#8377;0 Membership
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-sky-400"></span>
              &#8377;0 Shop
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
