import { SignupForm } from "@/components/signup-form";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-1 font-medium">
            <Image
              src="/logo-min.png"
              alt="FuelDev Logo"
              width={40}
              height={40}
            />
            FuelDev
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:flex items-center justify-end bg-muted overflow-hidden">
        <Image src="/milky-way.png" alt="Milky Way Background" fill priority />
      </div>
    </div>
  );
}
