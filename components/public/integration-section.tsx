"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function IntegrationSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const providers = [
    { id: "gpay", name: "Google Pay" },
    { id: "phone-pe", name: "PhonePe" },
    { id: "paytm", name: "Paytm" },
    { id: "upi", name: "UPI" },
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        ".text-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      );

      // 2. Reveal the Glass Card (Scale + Fade)
      gsap.fromTo(
        ".glass-card",
        { y: 50, scale: 0.95, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".glass-card",
            start: "top 85%",
          },
        },
      );

      // 3. Stagger in the logos
      gsap.fromTo(
        ".provider-logo",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".glass-card",
            start: "top 85%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-background overflow-hidden"
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header - Simple & Clean */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-reveal text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Payments, solved.
          </h2>
          <p className="text-reveal text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            One integration gives you access to the entire UPI ecosystem.
            <br className="hidden sm:block" />
            Simple, secure, and reliable.
          </p>
        </div>

        {/* The Premium Glass Card */}
        <div className="relative">
          {/* Subtle Glow Behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="glass-card relative z-10 mx-auto max-w-4xl rounded-[2.5rem] border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl p-8 sm:p-12">
            {/* The Logos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center mb-12">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="provider-logo group relative flex items-center justify-center w-full aspect-[3/2] transition-all duration-300 hover:scale-105"
                >
                  <div className="relative w-24 h-12 md:w-32 md:h-16 opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                    <Image
                      alt={provider.name}
                      src={`/${provider.id}.svg`} // Using your exact path structure
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8 opacity-50" />

            {/* Footer / Razorpay Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
              {/* Trust Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bank-grade Security</span>
              </div>

              {/* Powered By */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Powered by
                </span>
                <div className="relative w-24 h-6 opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    alt="Razorpay"
                    src="/razorpay.svg"
                    width={240}
                    height={50}
                    className="object-contain object-left sm:object-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
