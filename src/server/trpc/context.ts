import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/server/db";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Creates context for tRPC with session and database access
 * This runs for every request to ensure fresh session data
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    session,
    prisma,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
