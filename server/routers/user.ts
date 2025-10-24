import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { deleteUserAccount } from "@/lib/auth";

export const userRouter = router({
  // Get current authenticated user's session
  getSession: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
      session: ctx.session,
    };
  }),

  // Get current authenticated user with full details
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }),

  // Update current user's profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
      return user;
    }),

  // Public: Get all users (limited info)
  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
      take: 100,
    });
    return users;
  }),

  // Public: Get user by ID (limited info)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      });
      return user;
    }),

  // Delete current user's account
  deleteAccount: protectedProcedure.mutation(async () => {
    try {
      // Delete user account with all related data
      await deleteUserAccount();

      return { success: true };
    } catch (error) {
      console.error("Failed to delete account:", error);
      throw new Error("Failed to delete account");
    }
  }),
});
