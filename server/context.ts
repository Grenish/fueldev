import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    session,
    prisma,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
