/*
  Warnings:

  - A unique constraint covering the columns `[joinIndex]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,value]` on the table `verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('fixed', 'percent');

-- CreateEnum
CREATE TYPE "DiscountOn" AS ENUM ('all', 'category');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('expired', 'active', 'inactive');

-- AlterTable
ALTER TABLE "article" ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "joinIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "article_like" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_view" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_comment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_comment_reply" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_comment_reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_share" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT,
    "platform" TEXT,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "allowsMultiple" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "poll_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_vote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pollId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "poll_vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creators_store" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeName" TEXT NOT NULL,
    "storeLogo" TEXT,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,

    CONSTRAINT "creators_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverArt" TEXT,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "question" TEXT,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "customMessage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "store_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_category" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_policy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refundPolicyChoice" TEXT NOT NULL,
    "deliveryMethodChoice" TEXT NOT NULL,
    "supportAvailabilityChoice" TEXT NOT NULL,
    "paymentFinalityChoice" TEXT NOT NULL,
    "buyerInfoRequiredChoice" TEXT NOT NULL,
    "finalPolicyText" TEXT NOT NULL,
    "agreed" BOOLEAN NOT NULL DEFAULT false,
    "agreedAt" TIMESTAMP(3),
    "storeId" TEXT NOT NULL,

    CONSTRAINT "store_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon-code" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL DEFAULT 'fixed',
    "discountValue" INTEGER NOT NULL,
    "discountOn" "DiscountOn" NOT NULL DEFAULT 'all',
    "discountOnCategory" TEXT,
    "status" "Status" NOT NULL DEFAULT 'active',
    "claims" INTEGER NOT NULL,
    "limit" INTEGER,
    "expiry" TIMESTAMP(3),

    CONSTRAINT "coupon-code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_like_articleId_idx" ON "article_like"("articleId");

-- CreateIndex
CREATE INDEX "article_like_userId_idx" ON "article_like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "article_like_articleId_userId_key" ON "article_like"("articleId", "userId");

-- CreateIndex
CREATE INDEX "article_view_articleId_idx" ON "article_view"("articleId");

-- CreateIndex
CREATE INDEX "article_view_userId_idx" ON "article_view"("userId");

-- CreateIndex
CREATE INDEX "article_view_viewedAt_idx" ON "article_view"("viewedAt");

-- CreateIndex
CREATE INDEX "article_comment_articleId_idx" ON "article_comment"("articleId");

-- CreateIndex
CREATE INDEX "article_comment_userId_idx" ON "article_comment"("userId");

-- CreateIndex
CREATE INDEX "article_comment_createdAt_idx" ON "article_comment"("createdAt");

-- CreateIndex
CREATE INDEX "article_comment_reply_commentId_idx" ON "article_comment_reply"("commentId");

-- CreateIndex
CREATE INDEX "article_comment_reply_userId_idx" ON "article_comment_reply"("userId");

-- CreateIndex
CREATE INDEX "article_comment_reply_createdAt_idx" ON "article_comment_reply"("createdAt");

-- CreateIndex
CREATE INDEX "article_share_articleId_idx" ON "article_share"("articleId");

-- CreateIndex
CREATE INDEX "article_share_userId_idx" ON "article_share"("userId");

-- CreateIndex
CREATE INDEX "article_share_sharedAt_idx" ON "article_share"("sharedAt");

-- CreateIndex
CREATE INDEX "poll_userID_idx" ON "poll"("userID");

-- CreateIndex
CREATE INDEX "poll_isActive_idx" ON "poll"("isActive");

-- CreateIndex
CREATE INDEX "poll_createdAt_idx" ON "poll"("createdAt");

-- CreateIndex
CREATE INDEX "poll_option_pollId_idx" ON "poll_option"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "poll_option_pollId_order_key" ON "poll_option"("pollId", "order");

-- CreateIndex
CREATE INDEX "poll_vote_pollId_idx" ON "poll_vote"("pollId");

-- CreateIndex
CREATE INDEX "poll_vote_userId_idx" ON "poll_vote"("userId");

-- CreateIndex
CREATE INDEX "poll_vote_createdAt_idx" ON "poll_vote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "poll_vote_pollId_userId_optionId_key" ON "poll_vote"("pollId", "userId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "creators_store_storeName_key" ON "creators_store"("storeName");

-- CreateIndex
CREATE INDEX "store_product_storeId_idx" ON "store_product"("storeId");

-- CreateIndex
CREATE INDEX "store_product_categoryId_idx" ON "store_product"("categoryId");

-- CreateIndex
CREATE INDEX "store_product_published_idx" ON "store_product"("published");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_slug_key" ON "product_category"("slug");

-- CreateIndex
CREATE INDEX "product_category_storeId_idx" ON "product_category"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_storeId_name_key" ON "product_category"("storeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "store_policy_storeId_key" ON "store_policy"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "coupon-code_serial_key" ON "coupon-code"("serial");

-- CreateIndex
CREATE INDEX "coupon-code_serial_idx" ON "coupon-code"("serial");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_joinIndex_key" ON "user"("joinIndex");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

-- AddForeignKey
ALTER TABLE "article_like" ADD CONSTRAINT "article_like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_view" ADD CONSTRAINT "article_view_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment_reply" ADD CONSTRAINT "article_comment_reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "article_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment_reply" ADD CONSTRAINT "article_comment_reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_share" ADD CONSTRAINT "article_share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll" ADD CONSTRAINT "poll_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "poll_option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creators_store" ADD CONSTRAINT "creators_store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_product" ADD CONSTRAINT "store_product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "creators_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_product" ADD CONSTRAINT "store_product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "creators_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_policy" ADD CONSTRAINT "store_policy_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "creators_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon-code" ADD CONSTRAINT "coupon-code_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "creators_store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
