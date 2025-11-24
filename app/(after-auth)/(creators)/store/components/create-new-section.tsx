"use client";

import React from "react";
import {
  FileText,
  Video,
  Ticket,
  Package,
  Lock,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { slugifyStoreName } from "@/lib/utils";

interface CreationOption {
  title: string;
  desc: string;
  icon: React.ReactNode;
  isDisabled: boolean;
  templateKey: string;
}

interface CreateNewSectionProps {
  storeName: string;
}

const defaultCreationOptions: CreationOption[] = [
  {
    title: "Digital Product",
    desc: "E-books, software, assets",
    icon: <FileText className="h-5 w-5" />,
    isDisabled: false,
    templateKey: "digital-product",
  },
  {
    title: "Physical Good",
    desc: "Merch, apparel, crafts",
    icon: <Package className="h-5 w-5" />,
    isDisabled: true,
    templateKey: "physical-good",
  },
  {
    title: "Coaching Call",
    desc: "1-on-1 consultations",
    icon: <Video className="h-5 w-5" />,
    isDisabled: false,
    templateKey: "coaching-call",
  },
  {
    title: "Membership",
    desc: "Recurring access",
    icon: <Lock className="h-5 w-5" />,
    isDisabled: false,
    templateKey: "membership",
  },
  {
    title: "Event Ticket",
    desc: "Webinars, workshops",
    icon: <Ticket className="h-5 w-5" />,
    isDisabled: false,
    templateKey: "event-ticket",
  },
  {
    title: "Custom Item",
    desc: "Start from scratch",
    icon: <Plus className="h-5 w-5" />,
    isDisabled: false,
    templateKey: "custom-item",
  },
];

export function CreateNewSection({ storeName }: CreateNewSectionProps) {
  const storeSlug = slugifyStoreName(storeName);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium tracking-tight">Create New</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {defaultCreationOptions.map((item, idx) => {
          const createUrl = `/store/${storeSlug}/create?template=${item.templateKey}`;

          const cardContent = (
            <>
              {item.isDisabled && (
                <Badge
                  variant="outline"
                  className="absolute right-4 top-4 z-10 border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                >
                  Coming Soon
                </Badge>
              )}
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-secondary/50 p-3 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {item.icon}
                </div>
                {!item.isDisabled && (
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-card-foreground">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.desc}
                </p>
              </div>
            </>
          );

          const className = `group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 ${
            item.isDisabled
              ? "cursor-not-allowed opacity-60 grayscale-[.5] hover:border-border hover:shadow-none"
              : "hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
          }`;

          if (item.isDisabled) {
            return (
              <button key={idx} disabled className={className}>
                {cardContent}
              </button>
            );
          }

          return (
            <Link key={idx} href={createUrl} className={className}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
