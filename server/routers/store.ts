import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { defaultStoreAvatars, pickRandom } from "@/util/default";

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

      // Assign a random default store avatar
      const defaultAvatar = pickRandom(defaultStoreAvatars);

      const store = await ctx.prisma.creatorsStore.create({
        data: {
          storeName,
          description: storeDescription,
          ownerId: ctx.user.id,
          ownerName: ctx.user.name,
          storeLogo: defaultAvatar.url,
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

  createCoupon: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        name: z.string().min(3),
        couponCode: z.string().min(2),
        discountType: z.enum(["fixed", "percent"]),
        discountValue: z.number().min(1),
        discountOn: z.enum(["all", "category"]),
        discountOnCategory: z.string().optional(),
        limit: z.number().optional(),
        expiry: z.coerce.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.creatorsStore.findUnique({
        where: { id: input.storeId },
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
          message: "You do not have permission to create coupons for this store",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { joinIndex: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const year = new Date().getFullYear();
      const indexPart = user.joinIndex.toString().padStart(5, "0");
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const serial = `${year}-${indexPart}-${randomPart}`;

      const coupon = await ctx.prisma.couponCode.create({
        data: {
          storeId: input.storeId,
          name: input.name,
          couponCode: input.couponCode,
          discountType: input.discountType,
          discountValue: input.discountValue,
          discountOn: input.discountOn,
          discountOnCategory: input.discountOnCategory,
          limit: input.limit,
          expiry: input.expiry,
          serial: serial,
          claims: 0,
          status: "active",
        },
      });

      return coupon;
    }),

  getCoupons: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.creatorsStore.findUnique({
        where: { id: input.storeId },
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
          message: "You do not have permission to view coupons for this store",
        });
      }

      return ctx.prisma.couponCode.findMany({
        where: { storeId: input.storeId },
        orderBy: { id: "desc" },
      });
    }),
});
