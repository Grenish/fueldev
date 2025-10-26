"use client";

import * as React from "react";
import {
  Bell,
  ExternalLink,
  HeartHandshake,
  Home,
  Plug,
  Store,
  User,
  Users,
  Wallet,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Creator Hub",
      url: "#",
      icon: HeartHandshake,
      isActive: true,
      items: [
        {
          title: "Edit Profile",
          url: "#",
        },
        {
          title: "Create Post",
          url: "#",
        },
        {
          title: "Manage Page",
          url: "#",
        },
      ],
    },
    {
      title: "Audience",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Members",
          url: "#",
        },
        {
          title: "Insights",
          url: "#",
        },
      ],
    },
    {
      title: "Store",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Products",
          url: "#",
        },
        {
          title: "Add New Item",
          url: "#",
        },
        {
          title: "Orders",
          url: "#",
        },
      ],
    },
    {
      title: "Earnings",
      url: "#",
      icon: Wallet,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Withdraw Funds",
          url: "#",
        },
        {
          title: "Transactions",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 overflow-hidden">
          <Image
            src="/logo-min.png"
            alt="Logo"
            width={40}
            height={40}
            className="shrink-0"
          />
          <div className="flex flex-col leading-tight transition-all duration-300 overflow-hidden">
            <span className="text-lg font-semibold truncate">Grenish</span>
            <span className="text-sm text-muted-foreground truncate">
              FuelDev
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Home /> Home
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <ExternalLink /> View Page
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarContent>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="home/settings/account">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="home/settings/notifications">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="home/settings/payments">
                    <Wallet className="h-4 w-4" />
                    Payments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="home/settings/integrations">
                    <Plug className="h-4 w-4" />
                    Integrations
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarContent>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
