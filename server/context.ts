import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  // Get session without throwing errors
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: opts.req.headers,
    });
  } catch (error) {
    // Log session retrieval errors in development only
    if (process.env.NODE_ENV === "development") {
      console.error("Error retrieving session:", error);
    }
    // Continue with null session rather than failing
  }

  return {
    session,
    prisma,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
