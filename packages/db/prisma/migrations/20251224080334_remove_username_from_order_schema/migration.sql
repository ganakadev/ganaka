/*
  Warnings:

  - You are about to drop the column `username` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "orders_runId_username_idx";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "username";

-- CreateIndex
CREATE INDEX "orders_runId_nseSymbol_idx" ON "orders"("runId", "nseSymbol");
