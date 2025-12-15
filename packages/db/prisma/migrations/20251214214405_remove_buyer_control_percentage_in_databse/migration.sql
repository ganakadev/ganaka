/*
  Warnings:

  - You are about to drop the column `buyerControlPercentage` on the `quote_snapshots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quote_snapshots" DROP COLUMN "buyerControlPercentage";
