import { AppSidebar } from "@/components/protected/app-sidebar";
import { DynamicBreadcrumb } from "@/components/protected/dynamic-breadcrumb";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function protectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <main className="relative w-full bg-muted/50 h-[calc(100svh-1rem)] rounded-none sm:rounded-2xl overflow-hidden">
          <header className="absolute top-0 left-0 right-0 z-10 flex h-16 shrink-0 items-center justify-between px-4 backdrop-blur-sm  ">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb userName={user.name} />
            </div>
            <ThemeSwitcher />
          </header>

          <div className="h-full overflow-y-auto pt-16">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
