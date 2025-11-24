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
import { usePathname } from "next/navigation";

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
import { trpc } from "@/lib/trpc/react";
import { slugifyStoreName } from "@/lib/utils";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}) {
  const pathname = usePathname();
  const { data: myStores } = trpc.store.getMyStores.useQuery();

  // Prepare user data for NavUser component
  const userData = {
    name: user.name,
    email: user.email,
    avatar: user.image || "/avatars/default.jpg",
  };

  // Prepare navigation data based on store status
  const data = {
    navMain: [
      {
        title: "Creator Hub",
        url: "#",
        icon: HeartHandshake,
        isActive: true,
        items: [
          {
            title: "Links",
            url: "/hub/links",
          },
          {
            title: "Page",
            url: "/hub/creator-page",
          },
          {
            title: "Posts",
            url: "/hub/posts",
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
        items: myStores?.[0]
          ? [
              {
                title: myStores[0].storeName,
                url: `/store/${slugifyStoreName(myStores[0].storeName)}`,
              },
            ]
          : [
              {
                title: "Create New (0/1)",
                url: "/store/create-store",
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
            <span className="text-lg font-semibold truncate">{user.name}</span>
            <span className="text-sm text-muted-foreground truncate">
              FuelDev
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          <SidebarMenuItem className="outline-none">
            <SidebarMenuButton asChild isActive={pathname === "/home"}>
              <Link href={"/home"}>
                <Home /> Home
              </Link>
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
              <SidebarMenuItem className="outline-none">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/home/settings/account"}
                >
                  <Link href="/home/settings/account">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="outline-none">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/home/settings/notifications"}
                >
                  <Link href="/home/settings/notifications">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/home/settings/payments"}
                >
                  <Link href="/home/settings/payments">
                    <Wallet className="h-4 w-4" />
                    Payments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/home/settings/integrations"}
                >
                  <Link href="/home/settings/integrations">
                    <Plug className="h-4 w-4" />
                    Integrations
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarContent>
        </SidebarMenu>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
