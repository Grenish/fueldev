import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

function LoginFormSuspense() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full max-w-xs h-64">
          <Spinner />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-1 font-medium">
            <Image
              src={"/logo-min.png"}
              alt="FuelDev Logo"
              width={40}
              height={40}
            />
            FuelDev
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginFormSuspense />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block bg-[url('/milky-way.png')] bg-cover bg-no-repeat bg-center"></div>
    </div>
  );
}
