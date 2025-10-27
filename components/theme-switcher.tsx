"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ThemeSwitcher({ className, ...props }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
          className,
        )}
        {...props}
      >
        <div className="flex space-x-0">
          <div className="size-6 rounded-full bg-input animate-pulse" />
          <div className="size-6 rounded-full bg-input animate-pulse" />
          <div className="size-6 rounded-full bg-input animate-pulse" />
        </div>
      </div>
    );
  }

  const themes = [
    { value: "system", icon: MonitorIcon, label: "Switch to system theme" },
    { value: "light", icon: SunIcon, label: "Switch to light theme" },
    { value: "dark", icon: MoonIcon, label: "Switch to dark theme" },
  ];

  const currentIndex = themes.findIndex((t) => t.value === theme) || 0;

  return (
    <div
      className={cn(
        "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
        className,
      )}
      {...props}
    >
      <motion.div
        className="absolute -z-1 size-6 rounded-full bg-secondary-foreground"
        initial={false}
        animate={{
          x: currentIndex * 24,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* Buttons */}
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          aria-label={label}
          title={label}
          type="button"
          onClick={() => setTheme(value)}
          className="group relative size-6 rounded-full transition duration-200 ease-out"
        >
          <Icon
            className={cn(
              "relative m-auto size-3.5 transition duration-200 ease-out",
              theme === value
                ? "text-background"
                : "text-secondary-foreground group-hover:text-foreground group-focus-visible:text-foreground",
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
