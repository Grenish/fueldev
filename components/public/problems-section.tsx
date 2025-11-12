"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function ProblemsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const items = [
    {
      title: "Keep What You Earn",
      problem: "Other platforms take 10–30% from every contribution.",
      solution:
        "FuelDev charges 0% on earnings — only a flat 2% fee when you withdraw.",
    },
    {
      title: "Instant Local Payouts",
      problem: "International transfers delay payments by days.",
      solution:
        "Receive funds instantly via UPI or same-day to your bank account.",
    },
    {
      title: "Full Transparency",
      problem: "Hidden fees and unclear deductions create mistrust.",
      solution:
        "Our 2% fee is clear, fixed, and visible before every withdrawal.",
    },
  ];

  useGSAP(
    () => {
      // Animate header elements
      gsap.fromTo(
        ".problems-header",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".problems-header",
            start: "top 80%",
            once: true,
          },
        },
      );

      // Animate each problem/solution row
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;

        // Animate the index number
        gsap.fromTo(
          item.querySelector(".index-number"),
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 0.1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              once: true,
            },
          },
        );

        // Animate problem text
        gsap.fromTo(
          item.querySelector(".problem-content"),
          {
            opacity: 0,
            x: -30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: idx * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              once: true,
            },
          },
        );

        // Animate divider
        gsap.fromTo(
          item.querySelector(".divider-line"),
          {
            scaleY: 0,
          },
          {
            scaleY: 1,
            duration: 0.6,
            delay: idx * 0.1 + 0.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              once: true,
            },
          },
        );

        // Animate solution box
        gsap.fromTo(
          item.querySelector(".solution-content"),
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: idx * 0.1 + 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              once: true,
            },
          },
        );
      });

      // Animate bottom statement
      gsap.fromTo(
        ".bottom-statement",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".bottom-statement",
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with creative layout */}
        <div className="problems-header grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="inline-block text-sm font-medium text-primary mb-4">
              Problems We Solve
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why creators deserve
              <br />
              <span className="text-muted-foreground">better</span>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-muted-foreground lg:text-right">
              Current platforms don&apos;t serve Indian creators. FuelDev
              changes that.
            </p>
          </div>
        </div>

        <div className="relative">
          {items.map((item, idx) => (
            <div
              key={item.title}
              ref={(el) => {
                if (el) itemsRef.current[idx] = el;
              }}
              className="group mb-8 last:mb-0"
            >
              <div className="grid grid-cols-12 gap-4 items-stretch">
                {/* Index */}
                <div className="col-span-1 flex items-center">
                  <span className="index-number text-6xl text-muted-foreground select-none opacity-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Problem Side */}
                <div className="col-span-12 md:col-span-5 md:col-start-2">
                  <div className="problem-content h-full flex flex-col justify-center py-8 md:py-12 opacity-0">
                    <h3 className="text-sm font-medium mb-3">{item.title}</h3>
                    <p className="text-2xl md:text-3xl font-light leading-snug text-muted-foreground">
                      {item.problem}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex col-span-1 items-center justify-center">
                  <div className="divider-line relative h-full w-px bg-border origin-top">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background border border-border" />
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="solution-content relative h-full flex flex-col justify-center py-8 md:py-12 px-6 md:px-8 bg-muted/10 rounded-2xl border border-transparent hover:border-primary/20 transition-colors opacity-0">
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl" />

                    <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary/70 mb-3">
                      We offer
                    </span>
                    <p className="text-xl md:text-2xl font-medium text-foreground">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
