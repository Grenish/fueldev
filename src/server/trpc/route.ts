import { router, publicProcedure, protectedProcedure } from "./index";
import { z } from "zod";

/**
 * Auth router with procedures for authentication and user management
 */
export const authRouter = router({
  /**
   * Get current session (public - returns null if not authenticated)
   */
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),

  /**
   * Get current user profile (protected - requires authentication)
   */
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  /**
   * Update user profile (protected)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().url().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          image: input.image,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    }),

  /**
   * Get all user sessions (protected)
   */
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    const sessions = await ctx.prisma.session.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        createdAt: true,
        ipAddress: true,
        userAgent: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return sessions;
  }),

  /**
   * Revoke a specific session (protected)
   */
  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the session belongs to the current user
      const session = await ctx.prisma.session.findFirst({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
      });

      if (!session) {
        throw new Error("Session not found or doesn't belong to you");
      }

      // Delete the session
      await ctx.prisma.session.delete({
        where: { id: input.sessionId },
      });

      return { success: true };
    }),

  /**
   * Delete account (protected)
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // Delete user (cascade will handle sessions and accounts)
    await ctx.prisma.user.delete({
      where: { id: ctx.session.user.id },
    });

    return { success: true };
  }),
});

/**
 * Main app router - merge all routers here
 */
export const appRouter = router({
  auth: authRouter,
  // Add more routers here as your app grows
});

export type AppRouter = typeof appRouter;
