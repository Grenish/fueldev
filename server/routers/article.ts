import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { sanitizeArticleContent, generateExcerpt } from "@/lib/sanitize";

// ============================================================================
// SCHEMAS
// ============================================================================

const visibilitySchema = z.enum(["public", "private", "supporters", "members"]);

const createArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

const updateArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  visibility: visibilitySchema.optional(),
});

const publishArticleSchema = z.object({
  id: z.string(),
  visibility: visibilitySchema.default("public"),
  tags: z.array(z.string()).default([]),
  notifyFollowers: z.boolean().default(false),
  scheduledFor: z.string().datetime().optional().nullable(),
});

const listArticlesSchema = z.object({
  published: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

async function ensureUniqueSlug(
  prisma: typeof import("@/lib/prisma").prisma,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// ============================================================================
// ARTICLE ROUTER
// ============================================================================

export const articleRouter = router({
  /**
   * Create a new article
   */
  create: protectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const title = input.title || "Untitled";
      const baseSlug = generateSlug(title);
      const slug = await ensureUniqueSlug(ctx.prisma, baseSlug);

      // Sanitize content before storing
      const sanitizedContent = input.content
        ? sanitizeArticleContent(input.content)
        : "";

      const article = await ctx.prisma.article.create({
        data: {
          userId: ctx.user.id,
          title,
          slug,
          content: sanitizedContent,
          visibility: "private",
          published: false,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          visibility: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return article;
    }),

  /**
   * Update an existing article
   */
  update: protectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const existing = await ctx.prisma.article.findUnique({
        where: { id },
        select: { userId: true, title: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to edit this article",
        });
      }

      // Handle slug generation if title changed
      let slug: string | undefined;
      if (data.title && data.title !== existing.title) {
        const baseSlug = generateSlug(data.title);
        slug = await ensureUniqueSlug(ctx.prisma, baseSlug, id);
      }

      // Sanitize content before updating
      const sanitizedContent =
        data.content !== undefined
          ? sanitizeArticleContent(data.content)
          : undefined;

      // Auto-generate excerpt if not provided
      const excerpt =
        data.excerpt !== undefined
          ? data.excerpt
          : sanitizedContent
            ? generateExcerpt(sanitizedContent, 300)
            : undefined;

      const updateData: Prisma.ArticleUpdateInput = {
        ...(data.title && { title: data.title }),
        ...(sanitizedContent !== undefined && { content: sanitizedContent }),
        ...(excerpt !== undefined && { excerpt }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.visibility && { visibility: data.visibility }),
        ...(slug && { slug }),
        ...(data.tags && {
          tags: data.tags as unknown as Prisma.InputJsonValue,
        }),
      };

      const article = await ctx.prisma.article.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          coverImage: true,
          tags: true,
          visibility: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        ...article,
        tags: (article.tags as string[]) || [],
      };
    }),

  /**
   * Get all articles for the current user (optimized)
   */
  list: protectedProcedure
    .input(listArticlesSchema)
    .query(async ({ ctx, input }) => {
      const { published, limit, cursor } = input;

      const where: Prisma.ArticleWhereInput = {
        userId: ctx.user.id,
        ...(published !== undefined && { published }),
      };

      // Optimized query - only fetch necessary fields, no content field
      const articles = await ctx.prisma.article.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          tags: true,
          visibility: true,
          published: true,
          publishedAt: true,
          scheduledFor: true,
          viewCount: true,
          likeCount: true,
          createdAt: true,
          updatedAt: true,
          // Explicitly exclude content field for performance
        },
      });

      let nextCursor: string | undefined;
      if (articles.length > limit) {
        const nextItem = articles.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: articles.map((article) => ({
          ...article,
          tags: (article.tags as string[]) || [],
        })),
        nextCursor,
      };
    }),

  /**
   * Get a single article by ID (for editing/viewing) - optimized query
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Single optimized query with all needed fields
      const article = await ctx.prisma.article.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          userId: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          coverImage: true,
          tags: true,
          visibility: true,
          published: true,
          publishedAt: true,
          scheduledFor: true,
          viewCount: true,
          likeCount: true,
          shareCount: true,
          commentCount: true,
          notifyFollowers: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (article.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this article",
        });
      }

      return {
        ...article,
        tags: (article.tags as string[]) || [],
      };
    }),

  /**
   * Get a single article by slug (public view) - optimized with selective fields
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          userId: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          coverImage: true,
          tags: true,
          visibility: true,
          published: true,
          publishedAt: true,
          scheduledFor: true,
          viewCount: true,
          likeCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      const isOwner = ctx.user?.id === article.userId;

      // Only published articles are public
      if (!isOwner && !article.published) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This article is not published",
        });
      }

      // Increment view count for non-owners asynchronously
      if (!isOwner && article.published) {
        // Fire and forget - don't await, use void to satisfy linting
        void ctx.prisma.article
          .update({
            where: { id: article.id },
            data: { viewCount: { increment: 1 } },
          })
          .catch((err) =>
            console.error("Failed to increment view count:", err),
          );
      }

      return {
        ...article,
        tags: (article.tags as string[]) || [],
      };
    }),

  /**
   * Publish an article
   */
  publish: protectedProcedure
    .input(publishArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, visibility, tags, notifyFollowers, scheduledFor } = input;

      // Verify ownership
      const existing = await ctx.prisma.article.findUnique({
        where: { id },
        select: { userId: true, published: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to publish this article",
        });
      }

      const article = await ctx.prisma.article.update({
        where: { id },
        data: {
          published: true,
          publishedAt: existing.published ? undefined : new Date(),
          visibility,
          tags: tags as unknown as Prisma.InputJsonValue,
          notifyFollowers,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
          publishedAt: true,
          visibility: true,
          tags: true,
          scheduledFor: true,
        },
      });

      return {
        ...article,
        tags: (article.tags as string[]) || [],
      };
    }),

  /**
   * Unpublish an article
   */
  unpublish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existing = await ctx.prisma.article.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to unpublish this article",
        });
      }

      const article = await ctx.prisma.article.update({
        where: { id: input.id },
        data: { published: false },
        select: {
          id: true,
          published: true,
        },
      });

      return article;
    }),

  /**
   * Delete an article
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existing = await ctx.prisma.article.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this article",
        });
      }

      await ctx.prisma.article.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
