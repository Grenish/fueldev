import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  try {
    // Verify prisma client is available
    if (!prisma) {
      console.error("Prisma client is not initialized");
      throw new Error("Database connection not available");
    }

    const session = await auth.api.getSession({
      headers: opts.req.headers,
    });

    return {
      session,
      prisma,
      user: session?.user ?? null,
    };
  } catch (error) {
    console.error("Error creating tRPC context:", error);
    // Return context with null values to prevent complete failure
    return {
      session: null,
      prisma,
      user: null,
    };
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
