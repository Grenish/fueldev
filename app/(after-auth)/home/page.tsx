"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Users,
  CreditCard,
  ShoppingBag,
  Share2,
  MoreVertical,
  ArrowUpRight,
  Copy,
  Check,
  Store,
  Heart,
  Sparkles,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { QuoteResponse } from "@/lib/types/quote";

export default function ProtectedHomePage() {
  const { data: session, isPending } = useSession();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [copied, setCopied] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setQuoteLoading(true);
        setQuoteError(false);
        const res = await fetch("/api/quote");

        if (!res.ok) {
          throw new Error("Failed to fetch quote");
        }

        const data: QuoteResponse = await res.json();
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuoteError(true);
      } finally {
        setQuoteLoading(false);
      }
    };

    fetchQuote();
  }, []);

  const user = session?.user;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const periodLabels: Record<string, string> = {
    "7": "Last 7 days",
    "30": "Last 30 days",
    all: "All time",
  };

  const handleCopy = () => {
    const username = user ? getUsername(user.name) : "user";
    navigator.clipboard.writeText(`fueldev.in/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    {
      label: "Supporters",
      amount: "0",
      icon: Users,
      change: "+0%",
      changeType: "neutral",
    },
    {
      label: "Memberships",
      amount: "0",
      icon: CreditCard,
      change: "+0%",
      changeType: "neutral",
    },
    {
      label: "Products Sold",
      amount: "0",
      icon: ShoppingBag,
      change: "+0%",
      changeType: "neutral",
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: "Store",
      description: "Sell digital products",
      icon: Store,
      link: "/store",
    },
    {
      id: 2,
      title: "Memberships",
      description: "Create tiers",
      icon: Heart,
      link: "/membership",
    },
    {
      id: 3,
      title: "Customize",
      description: "Your page style",
      icon: Sparkles,
      link: "/customize",
    },
    {
      id: 4,
      title: "Updates",
      description: "Post to supporters",
      icon: MessageCircle,
      link: "/updates",
    },
  ];

  // Show loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  // If no user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load user data</p>
        </div>
      </div>
    );
  }

  const username = getUsername(user.name);
  const profileUrl = `fueldev.in/${username}`;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            {quoteLoading ? (
              <p className="text-sm text-muted-foreground mt-1 italic">
                Loading quote...
              </p>
            ) : quoteError ? (
              <p className="text-sm text-muted-foreground mt-1 italic">
                &ldquo;The only way to do great work is to love what you
                do.&rdquo;
              </p>
            ) : quote ? (
              <>
                <p className="text-sm text-muted-foreground mt-1 italic">
                  &ldquo;{quote.quote}&rdquo;
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  - {quote.author}
                </p>
              </>
            ) : null}
          </div>
          <Button variant="default" className="gap-2">
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Profile Card - Spans 2 columns on desktop */}
          <div className="lg:col-span-2 bg-card border rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 ring-4 ring-background">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Your Page URL
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-md font-mono">
                    {profileUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <Link href={`/${username}`}>
                    <ExternalLink className="size-4" />
                    View Page
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <Link href="/settings">
                    <Sparkles className="size-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Earnings Overview - Spans 2 columns on desktop */}
          <div className="lg:col-span-2 bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold">₹0.00</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {periodLabels[selectedPeriod]}
                    <ChevronDown className="size-4" />
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

            <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">Chart coming soon</p>
            </div>
          </div>

          {/* Stats Cards - Each takes 1 column */}
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="size-5 text-foreground" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">₹{stat.amount}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}

          {/* Quick Actions - Spans full width */}
          <div className="lg:col-span-4 bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link href="/actions">
                  View All
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.link}
                  className="group border rounded-lg p-4 hover:border-primary hover:bg-muted/50 transition-all"
                >
                  <div className="size-10 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                    <action.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions - Spans 3 columns on desktop */}
          <div className="lg:col-span-3 bg-card border rounded-xl overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  View All
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="divide-y">
              {/* Sample Transaction */}
              <div className="p-6 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <Avatar className="size-10">
                    <AvatarFallback className="text-sm font-medium bg-primary/10">
                      JD
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">John Doe</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        8 months ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      johndoe@gmail.com
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">₹5.00</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Refund Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              <div className="p-12">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CreditCard />
                    </EmptyMedia>
                    <EmptyTitle>No more transactions</EmptyTitle>
                    <EmptyDescription>
                      Your recent transactions will appear here
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            </div>
          </div>

          {/* Getting Started - Spans 1 column on desktop (sidebar) */}
          <div className="lg:col-span-1 bg-card border rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Complete your setup
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="size-3.5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Create account</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Setup your store</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-primary"
                    asChild
                  >
                    <Link href="/store/setup">Start now →</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Customize page</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-primary"
                    asChild
                  >
                    <Link href="/customize">Customize →</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Share your page</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-primary"
                    asChild
                  >
                    <Link href="/share">Share →</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="size-4 text-primary" />
                <p className="text-sm font-medium">Need help?</p>
              </div>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
