import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@/lib/generated/prisma/client";

// Schema for SavedSocial
const savedSocialSchema = z.object({
  iconName: z.string(),
  url: z.string().url(),
  isNsfw: z.boolean().default(false),
  icon: z.any(), // Icon component - we'll store the iconName and reconstruct on client
});

// Schema for different block types
const headingBlockSchema = z.object({
  id: z.string(),
  type: z.literal("heading"),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string(),
  align: z.enum(["left", "center", "right"]).optional(),
});

const paragraphBlockSchema = z.object({
  id: z.string(),
  type: z.literal("paragraph"),
  text: z.string(),
  align: z.enum(["left", "center", "right"]).optional(),
});

const linkBlockSchema = z.object({
  id: z.string(),
  type: z.literal("link"),
  title: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  isNsfw: z.boolean().optional(),
});

const buttonBlockSchema = z.object({
  id: z.string(),
  type: z.literal("button"),
  label: z.string(),
  url: z.string().url(),
});

const imageBlockSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  src: z.string().url(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  linkUrl: z.string().url().optional(),
});

const embedBlockSchema = z.object({
  id: z.string(),
  type: z.literal("embed"),
  url: z.string().url(),
  title: z.string().optional(),
});

const spotifyBlockSchema = z.object({
  id: z.string(),
  type: z.literal("spotify"),
  title: z.string(),
  artist: z.string().optional(),
  url: z.string().url(),
  coverUrl: z.string().url().optional(),
  useEmbed: z.boolean().optional(),
});

const listBlockSchema = z.object({
  id: z.string(),
  type: z.literal("list"),
  ordered: z.boolean().optional(),
  items: z.array(z.string()),
});

const spacerBlockSchema = z.object({
  id: z.string(),
  type: z.literal("spacer"),
  height: z.number(),
});

const projectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
});

const projectsBlockSchema = z.object({
  id: z.string(),
  type: z.literal("projects"),
  title: z.string(),
  items: z.array(projectItemSchema),
});

// Union schema for all block types
const anyBlockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  paragraphBlockSchema,
  linkBlockSchema,
  buttonBlockSchema,
  imageBlockSchema,
  embedBlockSchema,
  spotifyBlockSchema,
  listBlockSchema,
  spacerBlockSchema,
  projectsBlockSchema,
]);

// Schema for updating user links
const updateUserLinksSchema = z.object({
  name: z.string().optional(),
  handle: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  socials: z.array(savedSocialSchema).optional(),
  blocks: z.array(anyBlockSchema).optional(),
  published: z.boolean().optional(),
});

export const userLinksRouter = router({
  // Check if handle is available
  checkHandleAvailability: protectedProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const normalizedHandle = input.handle.startsWith("@")
        ? input.handle
        : `@${input.handle}`;

      const existingUser = await ctx.prisma.userLinks.findFirst({
        where: {
          handle: normalizedHandle,
          userId: { not: ctx.user.id },
        },
      });

      return { available: !existingUser };
    }),

  // Check if user can change handle (60-day restriction)
  canChangeHandle: protectedProcedure.query(async ({ ctx }) => {
    const userLinks = await ctx.prisma.userLinks.findUnique({
      where: { userId: ctx.user.id },
      select: { handleUpdatedAt: true },
    });

    if (!userLinks || !userLinks.handleUpdatedAt) {
      // First time changing handle or no links page yet
      return { canChange: true, daysRemaining: 0 };
    }

    const daysSinceLastChange = Math.floor(
      (Date.now() - userLinks.handleUpdatedAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const canChange = daysSinceLastChange >= 60;
    const daysRemaining = canChange ? 0 : 60 - daysSinceLastChange;

    return { canChange, daysRemaining };
  }),

  // Get current user's links page
  get: protectedProcedure.query(async ({ ctx }) => {
    const userLinks = await ctx.prisma.userLinks.findUnique({
      where: { userId: ctx.user.id },
    });

    if (!userLinks) {
      // Return default data if no links page exists yet
      return {
        id: null,
        userId: ctx.user.id,
        name: ctx.user.name || "",
        handle: `@${ctx.user.email.split("@")[0]}`,
        bio: "",
        avatarUrl: ctx.user.image || null,
        socials: [],
        blocks: [],
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      ...userLinks,
      avatarUrl: userLinks.avatarUrl || ctx.user.image || null,
      socials: userLinks.socials as Prisma.JsonArray,
      blocks: userLinks.blocks as Prisma.JsonArray,
    };
  }),

  // Get user links by handle (public)
  getByHandle: protectedProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const userLinks = await ctx.prisma.userLinks.findFirst({
        where: {
          handle: input.handle,
          published: true,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (!userLinks) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Links page not found",
        });
      }

      return {
        ...userLinks,
        socials: userLinks.socials as Prisma.JsonArray,
        blocks: userLinks.blocks as Prisma.JsonArray,
      };
    }),

  // Create or update user links
  upsert: protectedProcedure
    .input(updateUserLinksSchema)
    .mutation(async ({ ctx, input }) => {
      const data: Prisma.UserLinksUpdateInput = {};

      if (input.name !== undefined) data.name = input.name;

      // Handle update with 60-day restriction
      if (input.handle !== undefined) {
        const currentUserLinks = await ctx.prisma.userLinks.findUnique({
          where: { userId: ctx.user.id },
          select: { handle: true, handleUpdatedAt: true },
        });

        // Only check restriction if user is trying to change handle
        if (currentUserLinks && currentUserLinks.handle !== input.handle) {
          // Check 60-day restriction only if handle was previously updated
          if (currentUserLinks.handleUpdatedAt) {
            const daysSinceLastChange = Math.floor(
              (Date.now() - currentUserLinks.handleUpdatedAt.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            if (daysSinceLastChange < 60) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `You can only change your handle once every 60 days. ${60 - daysSinceLastChange} days remaining.`,
              });
            }
          }

          // Check if handle is already taken
          const existingHandle = await ctx.prisma.userLinks.findFirst({
            where: {
              handle: input.handle,
              userId: { not: ctx.user.id },
            },
          });

          if (existingHandle) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This handle is already taken.",
            });
          }

          data.handle = input.handle;
          data.handleUpdatedAt = new Date();
        } else if (!currentUserLinks) {
          // First time setting handle - don't set handleUpdatedAt
          data.handle = input.handle;
        }
      }

      if (input.bio !== undefined) data.bio = input.bio;
      if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
      if (input.published !== undefined) data.published = input.published;

      // Handle JSON fields
      if (input.socials !== undefined) {
        data.socials = JSON.parse(JSON.stringify(input.socials));
      }
      if (input.blocks !== undefined) {
        data.blocks = JSON.parse(JSON.stringify(input.blocks));
      }

      const userLinks = await ctx.prisma.userLinks.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          name: input.name || ctx.user.name || "",
          handle: input.handle || `@${ctx.user.email.split("@")[0]}`,
          bio: input.bio || "",
          avatarUrl: input.avatarUrl || ctx.user.image || null,
          socials: input.socials
            ? JSON.parse(JSON.stringify(input.socials))
            : [],
          blocks: input.blocks ? JSON.parse(JSON.stringify(input.blocks)) : [],
          published: input.published || false,
          // Don't set handleUpdatedAt on initial creation
        },
        update: data,
      });

      return {
        ...userLinks,
        socials: userLinks.socials as Prisma.JsonArray,
        blocks: userLinks.blocks as Prisma.JsonArray,
      };
    }),

  // Update only socials
  updateSocials: protectedProcedure
    .input(z.object({ socials: z.array(savedSocialSchema) }))
    .mutation(async ({ ctx, input }) => {
      const userLinks = await ctx.prisma.userLinks.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          name: ctx.user.name || "",
          handle: `@${ctx.user.email.split("@")[0]}`,
          bio: "",
          avatarUrl: ctx.user.image || null,
          socials: JSON.parse(JSON.stringify(input.socials)),
          blocks: [],
          // Don't set handleUpdatedAt on initial creation
        },
        update: {
          socials: JSON.parse(JSON.stringify(input.socials)),
        },
      });

      return {
        ...userLinks,
        socials: userLinks.socials as Prisma.JsonArray,
        blocks: userLinks.blocks as Prisma.JsonArray,
      };
    }),

  // Update only blocks
  updateBlocks: protectedProcedure
    .input(z.object({ blocks: z.array(anyBlockSchema) }))
    .mutation(async ({ ctx, input }) => {
      const userLinks = await ctx.prisma.userLinks.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          name: ctx.user.name || "",
          handle: `@${ctx.user.email.split("@")[0]}`,
          bio: "",
          avatarUrl: ctx.user.image || null,
          socials: [],
          blocks: JSON.parse(JSON.stringify(input.blocks)),
          // Don't set handleUpdatedAt on initial creation
        },
        update: {
          blocks: JSON.parse(JSON.stringify(input.blocks)),
        },
      });

      return {
        ...userLinks,
        socials: userLinks.socials as Prisma.JsonArray,
        blocks: userLinks.blocks as Prisma.JsonArray,
      };
    }),

  // Toggle publish status
  togglePublish: protectedProcedure.mutation(async ({ ctx }) => {
    const current = await ctx.prisma.userLinks.findUnique({
      where: { userId: ctx.user.id },
    });

    if (!current) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Links page not found. Please save your changes first.",
      });
    }

    const updated = await ctx.prisma.userLinks.update({
      where: { userId: ctx.user.id },
      data: { published: !current.published },
    });

    return {
      ...updated,
      socials: updated.socials as Prisma.JsonArray,
      blocks: updated.blocks as Prisma.JsonArray,
    };
  }),

  // Delete user links
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.userLinks.delete({
      where: { userId: ctx.user.id },
    });

    return { success: true };
  }),
});
