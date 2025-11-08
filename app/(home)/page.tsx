import Plasma from "@/components/Plasma";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex items-center justify-start relative overflow-hidden">
      <div className="flex flex-col items-start justify-start ml-56 z-10">
        <h2 className="text-6xl font-semibold w-2xl">
          The simplest way to support your favorite creators
        </h2>
        <p className="w-2xl mt-5 text-lg text-balance">
          For the creators who build quietly, beautifully, and bravely. FuelDev
          keeps it simple - you create, your community fuels you.
        </p>
        <div className="mt-5 flex items-center gap-5">
          <Button variant={"outline"}>Get Started</Button>
          <Button variant={"ghost"}>Explore More</Button>
        </div>
      </div>
      <div className="absolute right-0 w-9/12 top-0 h-full">
        <Plasma
          color="#ff6b35"
          speed={0.6}
          direction="forward"
          scale={0.5}
          opacity={0.8}
          quality="high"
          mouseInteractive={false}
        />
      </div>
    </div>
  );
}
