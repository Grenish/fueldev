import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import SuperJSON from "superjson";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public (unauthenticated) procedure
 * This is the base piece you use to build new queries and mutations on your tRPC API.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 * If you want a query or mutation to ONLY be accessible to logged in users, use this.
 * It verifies the session is valid and guarantees `ctx.session.user` is not null.
 */
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;

    // Check if session exists and has a user
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    return opts.next({
      ctx: {
        // Infers the `session` and `user` as non-nullable
        session: {
          ...ctx.session,
          user: ctx.session.user,
        },
        prisma: ctx.prisma,
        req: ctx.req,
        resHeaders: ctx.resHeaders,
      },
    });
  },
);
