"use client";

import React, { useState } from "react";
import {
  Plus,
  FileText,
  Video,
  Ticket,
  Package,
  Lock,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  LayoutGrid,
  List,
  Mountain,
  Edit,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Percent,
  Copy,
  Save,
  Trash2,
  User,
  Mail,
  Globe,
} from "lucide-react";

// Assuming standard Shadcn UI structure
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/animate-ui/components/radix/switch";

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState("Products");
  const [viewMode, setViewMode] = useState("list");

  // Updated tabs list
  const tabs = ["Products", "Orders", "Discounts", "Settings"];

  // --- MOCK DATA ---
  const creationOptions = [
    {
      title: "Digital Product",
      desc: "E-books, software, assets",
      icon: <FileText className="h-5 w-5" />,
      isDisabled: false,
    },
    {
      title: "Physical Good",
      desc: "Merch, apparel, crafts",
      icon: <Package className="h-5 w-5" />,
      isDisabled: true,
    },
    {
      title: "Coaching Call",
      desc: "1-on-1 consultations",
      icon: <Video className="h-5 w-5" />,
      isDisabled: false,
    },
    {
      title: "Membership",
      desc: "Recurring access",
      icon: <Lock className="h-5 w-5" />,
      isDisabled: false,
    },
    {
      title: "Event Ticket",
      desc: "Webinars, workshops",
      icon: <Ticket className="h-5 w-5" />,
      isDisabled: false,
    },
    {
      title: "Custom Item",
      desc: "Start from scratch",
      icon: <Plus className="h-5 w-5" />,
      isDisabled: false,
    },
  ];

  const orders = [
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

  const discounts = [
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

  return (
    <div className="min-h-screen w-full  text-foreground  selection:bg-primary/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border shadow-sm bg-card">
              <Mountain className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Acme Store
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hover:text-primary cursor-pointer transition-colors">
                    fueldev.com/store/acmestore
                  </span>
                </div>
              </div>

              <div className="group relative max-w-2xl rounded-xl border border-transparent bg-secondary/30 p-4 transition-all hover:border-border hover:bg-secondary/50">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Welcome to Acme Store! We offer a curated selection of digital
                  assets and physical goods, designed to empower creators and
                  innovators.
                </p>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 shadow-sm transition-all group-hover:opacity-100"
                  onClick={() => alert("Edit Store Description")}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 mt-8 md:mt-0">
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
        </div>

        {activeTab === "Products" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Create New */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium tracking-tight">
                  Create New
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creationOptions.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={item.isDisabled}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 ${
                      item.isDisabled
                        ? "cursor-not-allowed opacity-60 grayscale-[.5] hover:border-border hover:shadow-none"
                        : "hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
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
                  </button>
                ))}
              </div>
            </section>

            {/* Inventory */}
            <section>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  Inventory
                </h2>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="w-64 pl-9 bg-background"
                    />
                  </div>
                  <Button variant="outline" className="gap-2 bg-background">
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
                <div className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent/50 hover:border-primary/30">
                  <div className="flex items-center gap-5">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-secondary">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Package className="h-6 w-6 opacity-20" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">
                          Dark Mode UI Kit
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-primary/10 text-primary border-transparent"
                        >
                          Digital
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>$49.00</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span>24 Sales</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Sparkles className="h-3 w-3" /> High performing
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pr-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-foreground">
                        $1,176.00
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Revenue
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Recent Orders
              </h2>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {orders.map((order, i) => (
                <div
                  key={order.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-secondary/30 transition-colors ${i !== orders.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Placeholder */}
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                      {order.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {order.customer}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0 pl-14 md:pl-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                      <Clock className="h-3.5 w-3.5" />
                      {order.date}
                    </div>

                    <Badge
                      variant="secondary"
                      className={`
                        capitalize border-transparent
                        ${order.status === "paid" ? "bg-green-500/10 text-green-600 dark:text-green-400" : ""}
                        ${order.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : ""}
                        ${order.status === "failed" ? "bg-red-500/10 text-red-600 dark:text-red-400" : ""}
                     `}
                    >
                      {order.status === "paid" && (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      )}
                      {order.status === "failed" && (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {order.status}
                    </Badge>

                    <span className="font-semibold text-foreground min-w-[80px] text-right">
                      {order.total}
                    </span>

                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Discounts" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Active Coupons
              </h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Coupon
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Create New Card */}
              <button className="flex flex-col items-center justify-center h-full min-h-[160px] rounded-xl border-2 border-dashed border-border bg-secondary/20 hover:bg-secondary/50 hover:border-primary/30 transition-all group">
                <div className="rounded-full bg-background p-3 text-muted-foreground group-hover:text-primary shadow-sm border border-border transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="mt-3 font-medium text-sm text-muted-foreground">
                  Create new discount
                </span>
              </button>

              {/* Discount Cards */}
              {discounts.map((discount, i) => (
                <div
                  key={i}
                  className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <Percent className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-mono font-bold text-lg tracking-tight">
                          {discount.code}
                        </h4>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {discount.type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        discount.status === "active" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {discount.status}
                    </Badge>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold">{discount.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {discount.uses} times used
                      </p>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl mx-auto">
            <div className="space-y-8">
              {/* Section: Store Details */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Store Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your public store profile.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" defaultValue="Acme Store" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="storeUrl">Store URL</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                        fueldev.com/store/
                      </span>
                      <Input
                        id="storeUrl"
                        defaultValue="acmestore"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Input
                      id="desc"
                      className="h-24"
                      placeholder="Tell us about your store..."
                    />
                  </div>
                </div>
              </section>

              {/* Section: Preferences */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Currency and regional settings.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Store Currency</Label>
                      <p className="text-sm text-muted-foreground">
                        All products will be priced in USD.
                      </p>
                    </div>
                    <Badge variant="outline">USD ($)</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Hide your store from the public.
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Button variant="ghost">Discard</Button>
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="pt-10">
                <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50 p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-red-600 dark:text-red-400 font-medium">
                      Delete Store
                    </h4>
                    <p className="text-red-600/80 dark:text-red-400/70 text-sm">
                      Permanently delete your store and all data.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
