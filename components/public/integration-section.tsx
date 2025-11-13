"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function IntegrationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const providersRef = useRef<HTMLDivElement[]>([]);
  const lineRefs = useRef<HTMLDivElement[]>([]);

  const providers = [
    { id: "gpay", name: "Google Pay", description: "Most used" },
    { id: "phone-pe", name: "PhonePe", description: "Fastest growing" },
    { id: "paytm", name: "Paytm", description: "Widely accepted" },
    { id: "upi", name: "UPI", description: "Universal access" },
  ];

  useGSAP(
    () => {
      // Simple fade in for header
      gsap.fromTo(
        ".integration-header",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".integration-header",
            start: "top 85%",
            once: true,
          },
        },
      );

      // Animate connecting lines
      lineRefs.current.forEach((line, idx) => {
        if (!line) return;
        gsap.fromTo(
          line,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.8,
            delay: idx * 0.15,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      // Animate provider cards - simple and clean
      providersRef.current.forEach((card, idx) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: idx % 2 === 0 ? -30 : 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: idx * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      // Animate bottom section
      gsap.fromTo(
        ".integration-bottom",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".integration-bottom",
            start: "top 90%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative py-20 sm:py-24">
      <div className="container mx-auto  max-w-7xl px-4 sm:px-6">
        {/* Header - Clean and minimal */}
        <div className="integration-header mb-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Seamless Integration
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Payment infrastructure
              <span className="text-muted-foreground"> that just works</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Accept payments through India&apos;s most trusted UPI apps. One
              integration, complete coverage.
            </p>
          </div>
        </div>

        {/* Main Content - Asymmetric Grid */}
        <div className="relative">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {/* Left side - Large feature */}
            <div className="col-span-12 lg:col-span-5">
              <div className="h-full flex flex-col justify-center space-y-8">
                <div>
                  <h3 className="text-5xl sm:text-6xl font-light mb-2">
                    <span className="font-semibold">4</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Major payment platforms
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="text-sm text-muted-foreground">
                      Instant settlements
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="text-sm text-muted-foreground">
                      Zero setup fee
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="text-sm text-muted-foreground">
                      Industry-best success rates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Connecting lines */}
            <div className="hidden lg:flex col-span-2 items-center justify-center">
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="space-y-8">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      ref={(el) => {
                        if (el) lineRefs.current[idx] = el;
                      }}
                      className="h-px w-24 bg-linear-to-r from-transparent via-border to-transparent"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Provider cards */}
            <div className="col-span-12 lg:col-span-5">
              <div className="space-y-4">
                {providers.map((provider, idx) => (
                  <div
                    key={provider.id}
                    ref={(el) => {
                      if (el) providersRef.current[idx] = el;
                    }}
                    className="group opacity-0"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-border/60 transition-colors duration-300">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <Image
                          alt={provider.name}
                          src={`/${provider.id}.svg`}
                          width={32}
                          height={32}
                          className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground/90">
                          {provider.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {provider.description}
                        </p>
                      </div>

                      <div className="w-2 h-2 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors duration-300">
                        <div className="w-full h-full rounded-full bg-green-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Clean and professional */}
        <div className="integration-bottom mt-24 pt-12 border-t border-border/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-semibold">99.9%</p>
                <p className="text-xs text-muted-foreground mt-1">Uptime SLA</p>
              </div>
              <div className="h-8 w-px bg-border/40" />
              <div>
                <p className="text-2xl font-semibold">2.5s</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg. processing
                </p>
              </div>
              <div className="h-8 w-px bg-border/40" />
              <div>
                <p className="text-2xl font-semibold">24/7</p>
                <p className="text-xs text-muted-foreground mt-1">Support</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground">Powered by</p>
              <Image
                src="/razorpay.svg"
                width={80}
                height={28}
                alt="Razorpay"
                className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
