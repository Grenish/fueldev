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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ProtectedHomePage() {
  const { data: session, isPending } = useSession();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    { label: "Supporters", amount: "0", icon: Users },
    { label: "Membership", amount: "0", icon: CreditCard },
    { label: "Shop", amount: "0", icon: ShoppingBag },
  ];

  const nextSteps = [
    {
      id: 1,
      title: "Create and Manage a Store",
      description: "The creative way to sell your digital products.",
      icon: Store,
      primaryAction: "Create Store",
      secondaryAction: "Visit Store",
      primaryLink: "/store/create",
      secondaryLink: "/store",
    },
    {
      id: 2,
      title: "Enable Memberships",
      description: "Offer exclusive content to your loyal supporters.",
      icon: Heart,
      primaryAction: "Setup",
      secondaryAction: "Learn More",
      primaryLink: "/membership/setup",
      secondaryLink: "/membership",
    },
    {
      id: 3,
      title: "Customize Your Page",
      description: "Make your page unique with custom themes and layouts.",
      icon: Sparkles,
      primaryAction: "Customize",
      secondaryAction: "Preview",
      primaryLink: "/customize",
      secondaryLink: "/preview",
    },
    {
      id: 4,
      title: "Connect with Supporters",
      description: "Send updates and engage with your community.",
      icon: MessageCircle,
      primaryAction: "Send Update",
      secondaryAction: "Read",
      primaryLink: "/updates/new",
      secondaryLink: "/messages",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 340; // Approximate card width + gap
      const scrollAmount = cardWidth;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Check scroll on mount and resize
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  // If no user data, show error state
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="text-base font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold mb-1">Hi, {user.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {profileUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button className="gap-2" variant={"secondary"} size={"sm"}>
              <Share2 className="size-4" />
              Share Page
            </Button>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Earnings Overview</h2>
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

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Revenue
              </p>
              <p className="text-4xl font-bold tracking-tight">₹0.00</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                      <stat.icon className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold mb-1">₹{stat.amount}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Button variant="ghost" size="sm" className="gap-1.5">
                View All
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="divide-y">
            {/* Transaction Item */}
            <div className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="size-10">
                    <AvatarFallback className="text-sm font-medium">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-0.5">John Doe</p>
                    <p className="text-sm text-muted-foreground truncate">
                      johndoe@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-sm mb-0.5">₹5.00</p>
                    <p className="text-xs text-muted-foreground">
                      8 months ago
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
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

              {/* Mobile Amount */}
              <div className="flex items-center justify-between sm:hidden mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">8 months ago</p>
                <p className="font-semibold text-sm">₹5.00</p>
              </div>
            </div>

            {/* Empty State */}
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

        {/* What's Next Section */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">What&apos;s next?</h2>
                <p className="text-sm text-muted-foreground">
                  In fueldev.in you could do more!
                </p>
              </div>
              {nextSteps.length > 1 && (
                <div className="hidden md:flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => handleScroll("left")}
                    disabled={!canScrollLeft}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => handleScroll("right")}
                    disabled={!canScrollRight}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {nextSteps.map((step) => (
                <div
                  key={step.id}
                  className="snap-start shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] border rounded-lg p-4 bg-card"
                >
                  <div className="size-10 bg-primary/10 flex items-center justify-center rounded-md mb-3">
                    <step.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 line-clamp-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                    {step.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      className="flex-1"
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={step.primaryLink}>{step.primaryAction}</Link>
                    </Button>
                    <Button
                      className="flex-1"
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={step.secondaryLink}>
                        {step.secondaryAction}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Scroll Indicator */}
          {nextSteps.length > 1 && (
            <div className="md:hidden flex justify-center gap-1.5 pb-4">
              {nextSteps.map((_, index) => (
                <div
                  key={index}
                  className="size-1.5 rounded-full bg-muted transition-colors"
                  style={{
                    opacity: canScrollLeft && index === 0 ? 0.5 : 1,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
