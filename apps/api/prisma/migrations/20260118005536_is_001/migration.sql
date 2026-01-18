/*
  Warnings:

  - You are about to drop the column `settingsId` on the `income_sources` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."income_sources" DROP CONSTRAINT "income_sources_settingsId_fkey";

-- AlterTable
ALTER TABLE "public"."income_sources" DROP COLUMN "settingsId";
