import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

export const requireAuth = cache(async () => {
  const session = await getSession();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return {
    user: session.user,
    session: session.session,
  };
});
