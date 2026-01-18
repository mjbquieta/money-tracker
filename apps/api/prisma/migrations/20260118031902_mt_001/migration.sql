/*
  Warnings:

  - You are about to drop the column `expenseCategoryId` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the `expense_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `income_sources` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `budget_period_id` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DefaultCategory" AS ENUM ('BILLS', 'FOOD', 'TRANSPORT', 'SAVINGS', 'ENTERTAINMENT');

-- DropForeignKey
ALTER TABLE "public"."expense_categories" DROP CONSTRAINT "expense_categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_expenseCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."income_sources" DROP CONSTRAINT "income_sources_userId_fkey";

-- AlterTable
ALTER TABLE "public"."expenses" DROP COLUMN "expenseCategoryId",
DROP COLUMN "userId",
ADD COLUMN     "budget_period_id" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."expense_categories";

-- DropTable
DROP TABLE "public"."income_sources";

-- CreateTable
CREATE TABLE "public"."budget_periods" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "income" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "budget_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "default_category" "public"."DefaultCategory",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "public"."categories"("userId", "name");

-- AddForeignKey
ALTER TABLE "public"."budget_periods" ADD CONSTRAINT "budget_periods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_budget_period_id_fkey" FOREIGN KEY ("budget_period_id") REFERENCES "public"."budget_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
