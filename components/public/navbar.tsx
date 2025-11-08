import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import GlassSurface from "../GlassSurface";

export default function Navbar() {
  return (
    <header className="w-full p-2 fixed z-50">
      <GlassSurface
        saturation={1}
        opacity={1}
        displace={1.1}
        className="w-1/2 mx-auto rounded-full"
      >
        <div className=" flex w-full justify-between items-center px-2">
          <div className="inline-flex items-center select-none">
            <Image src={"/logo-min.png"} alt="logo" width={40} height={40} />
            <h2 className="text-xl font-semibold">FuelDev</h2>
          </div>
          <div>
            <Button size={"icon-sm"} className="rounded-full" variant={"ghost"}>
              <Menu />
            </Button>
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
