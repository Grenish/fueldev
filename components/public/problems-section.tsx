"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MoveRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ProblemsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const items = [
    {
      id: "01",
      category: "Revenue",
      problem: "Losing 30% to platform fees",
      solution: "Keep 100% of your earnings",
      description: "We don't tax your success. Just a flat 2% withdrawal fee when you're ready to cash out.",
      color: "bg-card", // Default card background
      textColor: "text-card-foreground",
    },
    {
      id: "02",
      category: "Speed",
      problem: "Waiting 7-14 days for payout",
      solution: "Instant UPI transfers",
      description: "Real-time settlements. The moment a supporter pays, the money is available to you.",
      color: "bg-primary", // Accent card
      textColor: "text-primary-foreground",
    },
    {
      id: "03",
      category: "Trust",
      problem: "Hidden FX & service charges",
      solution: "Total Transparency",
      description: "No hidden math. You see exactly what the supporter pays and exactly what lands in your bank.",
      color: "bg-zinc-950 dark:bg-white", // High contrast (Black in light mode, White in dark mode)
      textColor: "text-white dark:text-black",
    },
  ];

  useGSAP(
    () => {
      // For each card, we create a scale effect as it hits the top
      // This creates the "Stacking" visual depth
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top top", // When card hits top of viewport
            end: "bottom top",
            scrub: true,
            markers: false,
          },
          scale: 1 - (items.length - index) * 0.05, // Subtle scale down
          y: -20, // Slight push up
          opacity: 1 - (items.length - index) * 0.1, // Fade out slightly
          ease: "none",
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative bg-background py-24 sm:py-32">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">

        {/* Minimal Header */}
        <div className="mb-24 md:text-center max-w-2xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full border border-border bg-muted/50 text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            The Upgrade
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Don't settle for <br />
            <span className="opacity-40 font-serif italic">the old way.</span>
          </h2>
        </div>

        {/* The Stacking Deck */}
        <div className="relative">
          {items.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="sticky top-24 md:top-32 mb-12 last:mb-0" // CSS Sticky does the heavy lifting
            >
              <div
                className={`
                  relative overflow-hidden rounded-[2rem] p-8 md:p-16 border border-border shadow-2xl
                  ${item.color} ${item.textColor}
                  min-h-[500px] flex flex-col justify-between transition-colors
                `}
              >
                {/* Header of Card */}
                <div className="flex justify-between items-start border-b border-current/10 pb-8 mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono opacity-60">/{item.id}</span>
                    <span className="text-sm font-medium tracking-widest uppercase opacity-80">{item.category}</span>
                  </div>
                  <div className="hidden md:block">
                    <MoveRight className="w-6 h-6 opacity-40 -rotate-45" />
                  </div>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-12 items-end">

                  {/* Left: The Problem (Muted) */}
                  <div className="opacity-50">
                    <p className="font-serif italic text-xl md:text-2xl mb-2">
                      " {item.problem} "
                    </p>
                    <div className="h-px w-16 bg-current mt-4 opacity-50" />
                  </div>

                  {/* Right: The Solution (Bold) */}
                  <div className="relative">
                    <h3 className="text-4xl md:text-6xl font-bold leading-none tracking-tight mb-6">
                      {item.solution}
                      .</h3>
                    <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-md">
                      {item.description}
                    </p>
                  </div>

                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Spacer for bottom scrolling */}
        <div className="h-24" />
      </div>
    </section>
  );
}