import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// ============================================================================
// SCHEMAS
// ============================================================================

const likeArticleSchema = z.object({
  articleId: z.string(),
});

const trackViewSchema = z.object({
  articleId: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

const createCommentSchema = z.object({
  articleId: z.string(),
  content: z.string().min(1).max(5000),
});

const updateCommentSchema = z.object({
  commentId: z.string(),
  content: z.string().min(1).max(5000),
});

const deleteCommentSchema = z.object({
  commentId: z.string(),
});

const createReplySchema = z.object({
  commentId: z.string(),
  content: z.string().min(1).max(5000),
});

const updateReplySchema = z.object({
  replyId: z.string(),
  content: z.string().min(1).max(5000),
});

const deleteReplySchema = z.object({
  replyId: z.string(),
});

const trackShareSchema = z.object({
  articleId: z.string(),
  platform: z.string().optional(),
});

const getCommentsSchema = z.object({
  articleId: z.string(),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

const getRepliesSchema = z.object({
  commentId: z.string(),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

const getEngagementStatsSchema = z.object({
  articleId: z.string(),
});

// ============================================================================
// ARTICLE ENGAGEMENT ROUTER
// ============================================================================

export const articleEngagementRouter = router({
  /**
   * Like/Unlike an article
   */
  toggleLike: protectedProcedure
    .input(likeArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { articleId } = input;

      // Check if article exists
      const article = await ctx.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true, published: true },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      // Check if already liked
      const existingLike = await ctx.prisma.articleLike.findUnique({
        where: {
          articleId_userId: {
            articleId,
            userId: ctx.user.id,
          },
        },
      });

      if (existingLike) {
        // Unlike
        await ctx.prisma.$transaction([
          ctx.prisma.articleLike.delete({
            where: { id: existingLike.id },
          }),
          ctx.prisma.article.update({
            where: { id: articleId },
            data: { likeCount: { decrement: 1 } },
          }),
        ]);

        return { liked: false, likeCount: article.id };
      } else {
        // Like
        const [, updatedArticle] = await ctx.prisma.$transaction([
          ctx.prisma.articleLike.create({
            data: {
              articleId,
              userId: ctx.user.id,
            },
          }),
          ctx.prisma.article.update({
            where: { id: articleId },
            data: { likeCount: { increment: 1 } },
            select: { likeCount: true },
          }),
        ]);

        return { liked: true, likeCount: updatedArticle.likeCount };
      }
    }),

  /**
   * Check if user has liked an article
   */
  checkLikeStatus: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const like = await ctx.prisma.articleLike.findUnique({
        where: {
          articleId_userId: {
            articleId: input.articleId,
            userId: ctx.user.id,
          },
        },
      });

      return { liked: !!like };
    }),

  /**
   * Track article view (can be called by authenticated or anonymous users)
   */
  trackView: publicProcedure
    .input(trackViewSchema)
    .mutation(async ({ ctx, input }) => {
      const { articleId, ipAddress, userAgent } = input;

      // Check if article exists and is published
      const article = await ctx.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true, published: true, userId: true },
      });

      if (!article || !article.published) {
        return { success: false };
      }

      // Don't track views for article owners
      if (ctx.user?.id === article.userId) {
        return { success: false };
      }

      // Create view record
      await ctx.prisma.$transaction([
        ctx.prisma.articleView.create({
          data: {
            articleId,
            userId: ctx.user?.id,
            ipAddress,
            userAgent,
          },
        }),
        ctx.prisma.article.update({
          where: { id: articleId },
          data: { viewCount: { increment: 1 } },
        }),
      ]);

      return { success: true };
    }),

  /**
   * Create a comment on an article
   */
  createComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { articleId, content } = input;

      // Check if article exists and is published
      const article = await ctx.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true, published: true },
      });

      if (!article || !article.published) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found or not published",
        });
      }

      // Create comment and increment count
      const [comment] = await ctx.prisma.$transaction([
        ctx.prisma.articleComment.create({
          data: {
            articleId,
            userId: ctx.user.id,
            content,
          },
          select: {
            id: true,
            content: true,
            userId: true,
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
        }),
        ctx.prisma.article.update({
          where: { id: articleId },
          data: { commentCount: { increment: 1 } },
        }),
      ]);

      return comment;
    }),

  /**
   * Update a comment
   */
  updateComment: protectedProcedure
    .input(updateCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { commentId, content } = input;

      // Check ownership
      const existingComment = await ctx.prisma.articleComment.findUnique({
        where: { id: commentId },
        select: { userId: true },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (existingComment.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to edit this comment",
        });
      }

      const comment = await ctx.prisma.articleComment.update({
        where: { id: commentId },
        data: { content },
        select: {
          id: true,
          content: true,
          userId: true,
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

      return comment;
    }),

  /**
   * Delete a comment
   */
  deleteComment: protectedProcedure
    .input(deleteCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;

      // Check ownership
      const existingComment = await ctx.prisma.articleComment.findUnique({
        where: { id: commentId },
        select: { userId: true, articleId: true },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (existingComment.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this comment",
        });
      }

      // Delete comment and decrement count
      await ctx.prisma.$transaction([
        ctx.prisma.articleComment.delete({
          where: { id: commentId },
        }),
        ctx.prisma.article.update({
          where: { id: existingComment.articleId },
          data: { commentCount: { decrement: 1 } },
        }),
      ]);

      return { success: true };
    }),

  /**
   * Get comments for an article with pagination
   */
  getComments: publicProcedure
    .input(getCommentsSchema)
    .query(async ({ ctx, input }) => {
      const { articleId, limit, cursor } = input;

      const comments = await ctx.prisma.articleComment.findMany({
        where: { articleId },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      });

      let nextCursor: string | undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: comments,
        nextCursor,
      };
    }),

  /**
   * Create a reply to a comment
   */
  createReply: protectedProcedure
    .input(createReplySchema)
    .mutation(async ({ ctx, input }) => {
      const { commentId, content } = input;

      // Check if comment exists
      const comment = await ctx.prisma.articleComment.findUnique({
        where: { id: commentId },
        select: { id: true, articleId: true },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      const reply = await ctx.prisma.articleCommentReply.create({
        data: {
          commentId,
          userId: ctx.user.id,
          content,
        },
        select: {
          id: true,
          content: true,
          userId: true,
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

      return reply;
    }),

  /**
   * Update a reply
   */
  updateReply: protectedProcedure
    .input(updateReplySchema)
    .mutation(async ({ ctx, input }) => {
      const { replyId, content } = input;

      // Check ownership
      const existingReply = await ctx.prisma.articleCommentReply.findUnique({
        where: { id: replyId },
        select: { userId: true },
      });

      if (!existingReply) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reply not found",
        });
      }

      if (existingReply.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to edit this reply",
        });
      }

      const reply = await ctx.prisma.articleCommentReply.update({
        where: { id: replyId },
        data: { content },
        select: {
          id: true,
          content: true,
          userId: true,
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

      return reply;
    }),

  /**
   * Delete a reply
   */
  deleteReply: protectedProcedure
    .input(deleteReplySchema)
    .mutation(async ({ ctx, input }) => {
      const { replyId } = input;

      // Check ownership
      const existingReply = await ctx.prisma.articleCommentReply.findUnique({
        where: { id: replyId },
        select: { userId: true },
      });

      if (!existingReply) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reply not found",
        });
      }

      if (existingReply.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this reply",
        });
      }

      await ctx.prisma.articleCommentReply.delete({
        where: { id: replyId },
      });

      return { success: true };
    }),

  /**
   * Get replies for a comment with pagination
   */
  getReplies: publicProcedure
    .input(getRepliesSchema)
    .query(async ({ ctx, input }) => {
      const { commentId, limit, cursor } = input;

      const replies = await ctx.prisma.articleCommentReply.findMany({
        where: { commentId },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          userId: true,
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

      let nextCursor: string | undefined;
      if (replies.length > limit) {
        const nextItem = replies.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: replies,
        nextCursor,
      };
    }),

  /**
   * Track article share
   */
  trackShare: publicProcedure
    .input(trackShareSchema)
    .mutation(async ({ ctx, input }) => {
      const { articleId, platform } = input;

      // Check if article exists and is published
      const article = await ctx.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true, published: true },
      });

      if (!article || !article.published) {
        return { success: false };
      }

      // Create share record and increment count
      await ctx.prisma.$transaction([
        ctx.prisma.articleShare.create({
          data: {
            articleId,
            userId: ctx.user?.id,
            platform,
          },
        }),
        ctx.prisma.article.update({
          where: { id: articleId },
          data: { shareCount: { increment: 1 } },
        }),
      ]);

      return { success: true };
    }),

  /**
   * Get engagement statistics for an article
   */
  getEngagementStats: publicProcedure
    .input(getEngagementStatsSchema)
    .query(async ({ ctx, input }) => {
      const { articleId } = input;

      const article = await ctx.prisma.article.findUnique({
        where: { id: articleId },
        select: {
          viewCount: true,
          likeCount: true,
          shareCount: true,
          commentCount: true,
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      return article;
    }),
});
