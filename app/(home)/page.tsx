import Plasma from "@/components/Plasma";
import { FeaturesSection } from "@/components/public/feature-section";
import IntegrationSection from "@/components/public/integration-section";
import { ProblemsSection } from "@/components/public/problems-section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{ contain: "layout style paint" }}
      >
        <div className="absolute inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:w-9/12 sm:h-full w-full h-full flex items-center justify-center">
          <Plasma
            color="#ff6b35"
            speed={0.6}
            direction="forward"
            scale={0.5}
            opacity={0.8}
            quality="medium"
            mouseInteractive={false}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-start justify-start w-full max-w-7xl z-10 lg:ml-0">
          <div className="w-full lg:w-2/3 xl:w-1/2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              The simplest way to support your favorite creators
            </h2>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-balance opacity-90">
              For the creators who build quietly, beautifully, and bravely.
              FuelDev keeps it simple - you create, your community fuels you.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
              <Link href={"/auth/signup"}>
                <Button variant={"outline"} className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button variant={"ghost"} className="w-full sm:w-auto group">
                Explore More{" "}
                <ArrowRight className="group-hover:rotate-90 transition-transform ease-in-out duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <section
        className="flex items-center justify-center"
        style={{ contain: "layout style paint" }}
      >
        <ProblemsSection />
      </section>
      <section
        className="flex items-center justify-center"
        style={{ contain: "layout style paint" }}
      >
        {/*<FeaturesSection />*/}
      </section>
      <section
        className="flex items-center justify-center"
        style={{ contain: "layout style paint" }}
      >
        <IntegrationSection />
      </section>
    </div>
  );
}
