"use client";

import { useRef } from "react";
import { Zap, Users, Shield, TrendingUp } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Zap,
      title: "Instant Earnings",
      description:
        "Your work deserves instant reward. Receive payments directly, fast and effortless.",
      keyword: "Speed",
    },
    {
      icon: Users,
      title: "Closer to Your Supporters",
      description:
        "A platform designed to strengthen connection and trust between you and your audience.",
      keyword: "Connection",
    },
    {
      icon: Shield,
      title: "Transparent by Design",
      description:
        "Every contribution is visible and traceable. No hidden fees, no fine print.",
      keyword: "Trust",
    },
    {
      icon: TrendingUp,
      title: "Insights that Matter",
      description:
        "Understand your audience deeply and grow with data-driven clarity.",
      keyword: "Growth",
    },
  ];

  useGSAP(
    () => {
      // Create a master timeline for the story
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      // Progress bar animation
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 1,
        ease: "none",
      });

      // Individual feature animations
      featuresRef.current.forEach((feature, idx) => {
        if (!feature) return;

        // Entry animation
        gsap.fromTo(
          feature,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: idx * 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: feature,
              start: "top 85%",
              once: true,
            },
          },
        );

        // Keyword emphasis animation
        gsap.fromTo(
          feature.querySelector(".feature-keyword"),
          {
            opacity: 0,
            letterSpacing: "0.5em",
          },
          {
            opacity: 1,
            letterSpacing: "0.3em",
            duration: 1,
            delay: idx * 0.2 + 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: feature,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      // Header animation
      gsap.fromTo(
        ".features-title",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-title",
            start: "top 80%",
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
      id="features"
      className="relative py-24 sm:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="problems-header grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="inline-block text-sm font-medium text-primary mb-4">
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
              <br />
              <span className="text-muted-foreground">to succeed</span>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-muted-foreground lg:text-right">
              Current platforms don&apos;t serve Indian creators. FuelDev
              changes that.
            </p>
          </div>
        </div>

        {/* Features as a flowing story */}
        <div className="space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.title}
                ref={(el) => {
                  if (el) featuresRef.current[index] = el;
                }}
                className="group"
              >
                <div
                  className={`
                    grid grid-cols-12 gap-8 items-start
                    ${isEven ? "" : ""}
                  `}
                >
                  {/* Number & Icon Column */}
                  <div
                    className={`
                      col-span-12 md:col-span-2
                      ${isEven ? "md:col-start-1" : "md:col-start-11"}
                      ${!isEven ? "md:order-2" : ""}
                    `}
                  >
                    <div className="flex md:flex-col items-center md:items-start gap-6">
                      <span className="text-6xl font-thin text-muted-foreground/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="h-12 w-12 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-foreground/60" />
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div
                    className={`
                      col-span-12 md:col-span-5
                      ${isEven ? "md:col-start-3" : "md:col-start-5"}
                      ${!isEven ? "md:order-1" : ""}
                    `}
                  >
                    <div className="space-y-6">
                      {/* Keyword */}
                      <span className="feature-keyword inline-block text-xs font-medium tracking-[0.3em] uppercase text-primary/70">
                        {feature.keyword}
                      </span>

                      {/* Title & Description */}
                      <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-light">
                          {feature.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                          {feature.description}
                        </p>
                      </div>

                      {/* Subtle indicator line */}
                      <div className="w-12 h-[1px] bg-foreground/10 group-hover:w-24 transition-all duration-500" />
                    </div>
                  </div>

                  {/* Empty space for breathing room */}
                  <div className="hidden md:block col-span-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing statement */}
        <div className="mt-32 pt-16 border-t border-border/20">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <p className="text-lg font-light text-center text-muted-foreground">
                This is how we empower
                <br />
                <span className="text-2xl font-light text-foreground">
                  10,000+ creators
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
