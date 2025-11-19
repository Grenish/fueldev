import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const storeRouter = router({
  createStoreWithPolicy: protectedProcedure
    .input(
      z.object({
        storeName: z.string().min(1).max(48),
        storeDescription: z.string().max(240).optional(),
        policies: z.object({
          refund: z.string(),
          delivery: z.string(),
          support: z.string(),
          payment: z.string(),
          buyer_info: z.string(),
        }),
        finalPolicyText: z.string(),
        emailPolicy: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { storeName, storeDescription, policies, finalPolicyText } = input;

      const existingStore = await ctx.prisma.creatorsStore.findUnique({
        where: { storeName },
      });

      if (existingStore) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A store with this name already exists",
        });
      }

      const store = await ctx.prisma.creatorsStore.create({
        data: {
          storeName,
          description: storeDescription,
          ownerId: ctx.user.id,
          ownerName: ctx.user.name,
        },
      });

      await ctx.prisma.storePolicy.create({
        data: {
          storeId: store.id,
          refundPolicyChoice: policies.refund,
          deliveryMethodChoice: policies.delivery,
          supportAvailabilityChoice: policies.support,
          paymentFinalityChoice: policies.payment,
          buyerInfoRequiredChoice: policies.buyer_info,
          finalPolicyText,
          agreed: true,
          agreedAt: new Date(),
        },
      });

      return store;
    }),

  updateStoreLogo: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        logoUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.creatorsStore.findFirst({
        where: { id: input.storeId, ownerId: ctx.user.id },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      return ctx.prisma.creatorsStore.update({
        where: { id: store.id },
        data: { storeLogo: input.logoUrl },
      });
    }),

  getMyStores: protectedProcedure.query(async ({ ctx }) => {
    const stores = await ctx.prisma.creatorsStore.findMany({
      where: { ownerId: ctx.user.id },
      include: {
        storePolicy: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return stores;
  }),

  getStoreById: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.creatorsStore.findUnique({
        where: { id: input.storeId },
        include: {
          storePolicy: true,
          products: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      if (store.ownerId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to access this store",
        });
      }

      return store;
    }),

  getStoreByName: protectedProcedure
    .input(z.object({ storeName: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.creatorsStore.findUnique({
        where: { storeName: input.storeName },
        include: {
          storePolicy: true,
          products: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      if (store.ownerId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to access this store",
        });
      }

      return store;
    }),
});
