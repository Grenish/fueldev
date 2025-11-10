"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Menu,
  X,
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
} from "lucide-react";
import GlassSurface from "../GlassSurface";
import { ThemeSwitcher } from "../theme-switcher";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className="w-full p-2 fixed z-50 top-0 left-0 right-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </GlassSurface>
      </motion.header>
      <AnimatePresence mode="wait">
        {isMenuOpen && <MenuPage onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

const MenuPage = ({ onClose }: { onClose: () => void }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>("Products");
  const [mobileActiveItem, setMobileActiveItem] = useState<string | null>(
    "Products",
  );

  const menuData = {
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
          icon: DollarSign,
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

  const navItems = Object.keys(menuData);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      />

      {/* Desktop Menu */}
      <motion.div
        className="hidden lg:block fixed top-14 left-0 right-0 z-40 mt-5"
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
          duration: 0.4,
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div
            className="bg-background/50 backdrop-blur-3xl border border-border rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            layoutId="menu-container"
          >
            <div className="flex h-[520px]">
              {/* Left Panel - Navigation */}
              <div className="w-[280px] border-r border-border p-6 flex flex-col">
                <motion.nav
                  className="flex-1 space-y-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((key) => {
                    const Icon = menuData[key as keyof typeof menuData].icon;
                    const isActive = hoveredItem === key;
                    return (
                      <motion.button
                        key={key}
                        variants={itemVariants}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full group text-left px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-foreground text-background"
                            : "hover:bg-muted"
                        }`}
                        onMouseEnter={() => setHoveredItem(key)}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 transition-all ${
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
                      </motion.button>
                    );
                  })}
                </motion.nav>

                <motion.div
                  className="flex items-center justify-between px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="text-sm">Theme</p>
                  <ThemeSwitcher />
                </motion.div>

                <motion.div
                  className="pt-4 mt-4 border-t border-border space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
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
                </motion.div>

                <motion.div
                  className="pt-4 mt-4 border-t border-border space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
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
                </motion.div>
              </div>

              {/* Right Panel - Content */}
              <div className="flex-1 p-8">
                <AnimatePresence mode="wait">
                  {hoveredItem &&
                    menuData[hoveredItem as keyof typeof menuData] && (
                      <motion.div
                        key={hoveredItem}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="mb-8">
                          <p className="text-sm text-muted-foreground mb-1">
                            {hoveredItem}
                          </p>
                          <h3 className="text-xl font-medium">
                            {
                              menuData[hoveredItem as keyof typeof menuData]
                                .description
                            }
                          </h3>
                        </div>

                        <div className="space-y-2">
                          {menuData[
                            hoveredItem as keyof typeof menuData
                          ].items.map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                              <motion.div key={idx} variants={cardVariants}>
                                <Link
                                  href={item.href}
                                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all"
                                  onClick={onClose}
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background group-hover:border-foreground/20 transition-all">
                                    <ItemIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
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
                                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile/Tablet Menu */}
      <motion.div
        className="lg:hidden fixed top-14 left-0 right-0 bottom-0 z-40 mt-5 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
          duration: 0.4,
        }}
      >
        <div className="min-h-full px-4 pb-20">
          <motion.div
            className="bg-background/50 backdrop-blur-3xl border border-border rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            layoutId="menu-container-mobile"
          >
            <div className="p-4">
              {/* Mobile Navigation - Accordion Style */}
              <motion.nav
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {navItems.map((key) => {
                  const Icon = menuData[key as keyof typeof menuData].icon;
                  const isActive = mobileActiveItem === key;
                  return (
                    <motion.div
                      key={key}
                      className="border-b border-border last:border-0"
                      variants={itemVariants}
                    >
                      <button
                        className="w-full text-left px-3 py-4 flex items-center justify-between"
                        onClick={() =>
                          setMobileActiveItem(isActive ? null : key)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{key}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            className="overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            <div className="px-3 pb-4">
                              <p className="text-sm text-muted-foreground mb-3">
                                {
                                  menuData[key as keyof typeof menuData]
                                    .description
                                }
                              </p>
                              <div className="space-y-2">
                                {menuData[
                                  key as keyof typeof menuData
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.nav>

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
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};
