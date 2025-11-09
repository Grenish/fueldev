"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import GlassSurface from "../GlassSurface";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full p-2 fixed z-50 top-0 left-0 right-0">
        <GlassSurface
          saturation={1}
          opacity={1}
          displace={1.1}
          className="w-1/2 mx-auto rounded-full"
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </GlassSurface>
      </header>
      {isMenuOpen && <MenuPage onClose={() => setIsMenuOpen(false)} />}
    </>
  );
}

const MenuPage = ({ onClose }: { onClose: () => void }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>("Products");

  const menuData = {
    Products: {
      description: "Build and grow your online presence",
      items: [
        {
          title: "Profile Builder",
          description: "Create your perfect creator profile",
          href: "#",
        },
        {
          title: "LinkHub",
          description: "All your important links in one place",
          href: "#",
        },
        {
          title: "Analytics Dashboard",
          description: "Track your growth and engagement",
          href: "#",
        },
        {
          title: "Monetization Tools",
          description: "Turn your content into revenue",
          href: "#",
        },
      ],
    },
    Solutions: {
      description: "Tailored for every creator",
      items: [
        {
          title: "For Content Creators",
          description: "YouTube, TikTok, and Instagram creators",
          href: "#",
        },
        {
          title: "For Writers",
          description: "Bloggers and newsletter authors",
          href: "#",
        },
        {
          title: "For Artists",
          description: "Digital artists and designers",
          href: "#",
        },
        {
          title: "For Educators",
          description: "Online courses and tutorials",
          href: "#",
        },
      ],
    },
    Resources: {
      description: "Learn and grow with us",
      items: [
        {
          title: "Blog",
          description: "Latest tips and industry insights",
          href: "#",
        },
        {
          title: "Creator Stories",
          description: "Success stories from our community",
          href: "#",
        },
        {
          title: "Help Center",
          description: "Get answers to your questions",
          href: "#",
        },
        {
          title: "API Documentation",
          description: "Build on top of FuelDev",
          href: "#",
        },
      ],
    },
    Company: {
      description: "Get to know FuelDev",
      items: [
        {
          title: "About Us",
          description: "Our mission and values",
          href: "#",
        },
        {
          title: "Careers",
          description: "Join our growing team",
          href: "#",
          badge: "We're hiring!",
        },
        {
          title: "Press",
          description: "FuelDev in the news",
          href: "#",
        },
        {
          title: "Contact",
          description: "Get in touch with us",
          href: "#",
        },
      ],
    },
  };

  return (
    <div
      className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40"
      onClick={onClose}
    >
      <div className="w-full h-full flex" onClick={(e) => e.stopPropagation()}>
        {/* Left Panel - Main Navigation */}
        <div className="w-[420px] h-full bg-muted/20 border-r border-border/50 flex flex-col">
          <div className="flex-1 pt-24 px-12">
            <nav className="space-y-2">
              {Object.keys(menuData).map((key) => (
                <button
                  key={key}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    hoveredItem === key
                      ? "bg-background/50 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onMouseEnter={() => setHoveredItem(key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-medium">{key}</span>
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${
                        hoveredItem === key ? "translate-x-1" : ""
                      }`}
                    />
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-12 space-y-4">
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
              >
                Changelog
              </Link>
            </div>
          </div>

          <div className="p-12 pt-0">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={onClose}
              >
                Sign In
              </Button>
              <Button className="w-full rounded-lg" onClick={onClose}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Submenu Items */}
        <div className="flex-1 flex items-center justify-center p-12">
          {hoveredItem && menuData[hoveredItem as keyof typeof menuData] && (
            <div className="w-full max-w-2xl">
              <p className="text-muted-foreground mb-8">
                {menuData[hoveredItem as keyof typeof menuData].description}
              </p>
              <div className="space-y-3">
                {menuData[hoveredItem as keyof typeof menuData].items.map(
                  (item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="group block p-4 rounded-xl hover:bg-muted/30 transition-all"
                      onClick={onClose}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
