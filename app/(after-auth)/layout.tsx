import { AppSidebar } from "@/components/protected/app-sidebar";
import { LayoutHeader } from "@/components/protected/layout-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
          <LayoutHeader userName={user.name} />

          <div className="h-full overflow-y-auto pt-16">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
