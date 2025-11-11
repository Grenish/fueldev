"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Menu,
  ArrowUpRight,
  User,
  Link2,
  BarChart3,
  DollarSign,
  Video,
  PenTool,
  Palette,
  GraduationCap,
  FileText,
  Star,
  HelpCircle,
  Code2,
  Info,
  Mail,
  Package,
  Target,
  BookOpen,
  Building2,
  ChevronDown,
  Shield,
  Scale,
  IndianRupee,
} from "lucide-react";
import GlassSurface from "../GlassSurface";
import { ThemeSwitcher } from "../theme-switcher";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Move static data outside component
const MENU_DATA = {
  Products: {
    description: "Everything you need to build your presence",
    icon: Package,
    items: [
      {
        title: "Profile Builder",
        description: "Create your perfect creator profile",
        href: "#",
        icon: User,
      },
      {
        title: "LinkHub",
        description: "All your important links in one place",
        href: "#",
        icon: Link2,
      },
      {
        title: "Analytics Dashboard",
        description: "Track your growth and engagement",
        href: "#",
        icon: BarChart3,
      },
      {
        title: "Monetization Tools",
        description: "Turn your content into revenue",
        href: "#",
        icon: IndianRupee,
      },
    ],
  },
  Solutions: {
    description: "Tailored for every type of creator",
    icon: Target,
    items: [
      {
        title: "Content Creators",
        description: "YouTube, TikTok, and Instagram",
        href: "#",
        icon: Video,
      },
      {
        title: "Writers",
        description: "Bloggers and newsletter authors",
        href: "#",
        icon: PenTool,
      },
      {
        title: "Artists",
        description: "Digital artists and designers",
        href: "#",
        icon: Palette,
      },
      {
        title: "Educators",
        description: "Online courses and tutorials",
        href: "#",
        icon: GraduationCap,
      },
    ],
  },
  Resources: {
    description: "Learn, grow, and get inspired",
    icon: BookOpen,
    items: [
      {
        title: "Blog",
        description: "Latest tips and insights",
        href: "#",
        icon: FileText,
      },
      {
        title: "Creator Stories",
        description: "Success from our community",
        href: "#",
        icon: Star,
      },
      {
        title: "Help Center",
        description: "Get answers to your questions",
        href: "#",
        icon: HelpCircle,
      },
      {
        title: "API Docs",
        description: "Build on top of FuelDev",
        href: "#",
        icon: Code2,
      },
    ],
  },
  Company: {
    description: "Get to know us better",
    icon: Building2,
    items: [
      {
        title: "About",
        description: "Our mission and values",
        href: "#",
        icon: Info,
      },
      {
        title: "Terms and Conditions",
        description: "Guidelines that keep FuelDev fair and transparent",
        href: "#",
        icon: Scale,
      },
      {
        title: "Privacy Policy",
        description: "How we respect and safeguard your personal data",
        href: "#",
        icon: Shield,
      },
      {
        title: "Contact",
        description: "Get in touch with us",
        href: "#",
        icon: Mail,
      },
    ],
  },
};

const NAV_ITEMS = Object.keys(MENU_DATA);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const iconContainerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | undefined>(undefined);

  // Initial header animation
  useGSAP(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }
  }, []);

  // Optimized icon animation with morphing effect
  useGSAP(() => {
    if (!iconContainerRef.current) return;

    // Kill existing timeline
    if (tlRef.current) tlRef.current.kill();

    tlRef.current = gsap.timeline();

    if (isMenuOpen) {
      tlRef.current
        .to(iconContainerRef.current, {
          rotateZ: 180,
          scale: 0.75,
          duration: 0.2,
          ease: "power2.in",
        })
        .set(iconContainerRef.current, {
          innerHTML:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
        })
        .to(iconContainerRef.current, {
          rotateZ: 0,
          scale: 1,
          duration: 0.25,
          ease: "back.out(2)",
        });
    } else {
      tlRef.current
        .to(iconContainerRef.current, {
          rotateZ: -180,
          scale: 0.75,
          duration: 0.2,
          ease: "power2.in",
        })
        .set(iconContainerRef.current, {
          innerHTML:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
        })
        .to(iconContainerRef.current, {
          rotateZ: 0,
          scale: 1,
          duration: 0.25,
          ease: "back.out(2)",
        });
    }
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="w-full p-2 fixed z-50 top-0 left-0 right-0 will-change-transform"
      >
        <GlassSurface
          saturation={1}
          opacity={1}
          displace={1.1}
          className="w-[90%] sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto rounded-full"
        >
          <div className="flex w-full justify-between items-center px-3 py-1">
            <div className="inline-flex items-center select-none gap-2">
              <Image src={"/logo-min.png"} alt="logo" width={36} height={36} />
              <h2 className="text-lg font-semibold">FuelDev</h2>
            </div>
            <Button
              size={"icon-sm"}
              className="rounded-full h-8 w-8"
              variant={"ghost"}
              onClick={toggleMenu}
            >
              <div ref={iconContainerRef} className="h-4 w-4">
                <Menu className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </GlassSurface>
      </header>
      {isMenuOpen && <MenuPage onClose={toggleMenu} />}
    </>
  );
}

const MenuPage = memo(({ onClose }: { onClose: () => void }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>("Products");
  const [mobileActiveItem, setMobileActiveItem] = useState<string | null>(
    "Products",
  );

  const backdropRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevHoveredItem = useRef<string | null>("Products");
  const animationRef = useRef<gsap.core.Timeline | undefined>(undefined);

  // Optimized entrance animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Set initial states for GPU acceleration
      gsap.set(
        [backdropRef.current, desktopMenuRef.current, mobileMenuRef.current],
        {
          willChange: "transform, opacity",
        },
      );

      // Backdrop with GPU acceleration
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
            clearProps: "willChange",
          },
        );
      }

      // Desktop menu with transform3d for GPU
      if (desktopMenuRef.current) {
        gsap.fromTo(
          desktopMenuRef.current,
          {
            opacity: 0,
            transform: "translate3d(0, -20px, 0) scale(0.98)",
          },
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0) scale(1)",
            duration: 0.35,
            ease: "power3.out",
            clearProps: "transform, willChange",
          },
        );
      }

      // Mobile menu
      if (mobileMenuRef.current) {
        gsap.fromTo(
          mobileMenuRef.current,
          {
            opacity: 0,
            transform: "translate3d(0, 20px, 0)",
          },
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
            duration: 0.35,
            ease: "power3.out",
            clearProps: "transform, willChange",
          },
        );
      }

      // Optimized nav items stagger
      const validNavItems = navItemsRef.current.filter(Boolean);
      if (validNavItems.length > 0) {
        gsap.fromTo(
          validNavItems,
          {
            opacity: 0,
            x: -15,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: {
              each: 0.03,
              ease: "power1.inOut",
            },
            ease: "power2.out",
            clearProps: "all",
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Ultra-smooth content transition
  useGSAP(() => {
    if (!contentRef.current || !hoveredItem) return;
    if (hoveredItem === prevHoveredItem.current) return;

    // Kill existing animation
    if (animationRef.current) animationRef.current.kill();

    const contentItems =
      contentRef.current.querySelectorAll(".menu-content-item");

    animationRef.current = gsap.timeline({
      onStart: () => {
        gsap.set(contentRef.current, { willChange: "transform, opacity" });
      },
      onComplete: () => {
        gsap.set(contentRef.current, { clearProps: "willChange" });
      },
    });

    animationRef.current
      .to(contentRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: "power2.in",
      })
      .call(() => {
        prevHoveredItem.current = hoveredItem;
      })
      .fromTo(
        contentRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        },
      )
      .fromTo(
        contentItems,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.025,
          ease: "power2.out",
          clearProps: "all",
        },
        "-=0.1",
      );
  }, [hoveredItem]);

  const handleNavHover = useCallback((key: string) => {
    setHoveredItem(key);
  }, []);

  const handleMobileToggle = useCallback((key: string) => {
    setMobileActiveItem((prev) => (prev === key ? null : key));
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Desktop Menu */}
      <div
        ref={desktopMenuRef}
        className="hidden lg:block fixed top-14 left-0 right-0 z-40 mt-5"
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <div
            className="bg-background/50 backdrop-blur-3xl border border-border rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[520px]">
              {/* Left Panel */}
              <div className="w-[280px] border-r border-border p-6 flex flex-col">
                <nav className="flex-1 space-y-1">
                  {NAV_ITEMS.map((key, index) => {
                    const Icon = MENU_DATA[key as keyof typeof MENU_DATA].icon;
                    const isActive = hoveredItem === key;
                    return (
                      <button
                        key={key}
                        ref={(el) => {
                          navItemsRef.current[index] = el;
                        }}
                        className={`w-full group text-left px-3 py-2.5 rounded-lg transition-all duration-200 transform-gpu ${
                          isActive
                            ? "bg-foreground text-background"
                            : "hover:bg-muted"
                        }`}
                        onMouseEnter={() => handleNavHover(key)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 transition-all duration-200 transform-gpu ${
                              isActive
                                ? "text-background scale-110"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={`font-medium text-sm ${
                              isActive ? "text-background" : "text-foreground"
                            }`}
                          >
                            {key}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="flex items-center justify-between px-2">
                  <p className="text-sm">Theme</p>
                  <ThemeSwitcher />
                </div>

                <div className="pt-4 mt-4 border-t border-border space-y-2">
                  <Link
                    href="#"
                    className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200"
                    onClick={onClose}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200"
                    onClick={onClose}
                  >
                    Changelog
                  </Link>
                </div>

                <div className="pt-4 mt-4 border-t border-border space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-center rounded-lg h-9 text-sm font-normal"
                    onClick={onClose}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-center rounded-lg h-9 text-sm"
                    onClick={onClose}
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Right Panel - Content */}
              <div className="flex-1 p-8">
                {hoveredItem &&
                  MENU_DATA[hoveredItem as keyof typeof MENU_DATA] && (
                    <div ref={contentRef}>
                      <div className="mb-8">
                        <p className="text-sm text-muted-foreground mb-1">
                          {hoveredItem}
                        </p>
                        <h3 className="text-xl font-medium">
                          {
                            MENU_DATA[hoveredItem as keyof typeof MENU_DATA]
                              .description
                          }
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {MENU_DATA[
                          hoveredItem as keyof typeof MENU_DATA
                        ].items.map((item, idx) => {
                          const ItemIcon = item.icon;
                          return (
                            <div key={idx} className="menu-content-item">
                              <Link
                                href={item.href}
                                className="group flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 transform-gpu"
                                onClick={onClose}
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background group-hover:border-foreground/20 transition-all duration-200">
                                  <ItemIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium">
                                      {item.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 transform-gpu" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden fixed top-14 left-0 right-0 bottom-0 z-40 mt-5 overflow-y-auto"
      >
        <div className="min-h-full px-4 pb-20">
          <div
            className="bg-background/50 backdrop-blur-3xl border border-border rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Mobile Navigation - Accordion Style */}
              <nav className="space-y-2">
                {NAV_ITEMS.map((key) => {
                  const Icon = MENU_DATA[key as keyof typeof MENU_DATA].icon;
                  const isActive = mobileActiveItem === key;
                  return (
                    <div
                      key={key}
                      className="border-b border-border last:border-0"
                    >
                      <button
                        className="w-full text-left px-3 py-4 flex items-center justify-between"
                        onClick={() => handleMobileToggle(key)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{key}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 transform-gpu ${
                            isActive ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isActive && (
                        <div className="overflow-hidden">
                          <div className="px-3 pb-4">
                            <p className="text-sm text-muted-foreground mb-3">
                              {
                                MENU_DATA[key as keyof typeof MENU_DATA]
                                  .description
                              }
                            </p>
                            <div className="space-y-2">
                              {MENU_DATA[
                                key as keyof typeof MENU_DATA
                              ].items.map((item, idx) => {
                                const ItemIcon = item.icon;
                                return (
                                  <Link
                                    key={idx}
                                    href={item.href}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 active:bg-muted/50 transition-colors"
                                    onClick={onClose}
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background">
                                      <ItemIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium">
                                        {item.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {item.description}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Mobile Footer Items */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-sm">Theme</p>
                  <ThemeSwitcher />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="#"
                    className="px-3 py-2 text-sm text-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all"
                    onClick={onClose}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#"
                    className="px-3 py-2 text-sm text-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all"
                    onClick={onClose}
                  >
                    Changelog
                  </Link>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-center rounded-lg h-10 text-sm"
                    onClick={onClose}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-center rounded-lg h-10 text-sm"
                    onClick={onClose}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

MenuPage.displayName = "MenuPage";
