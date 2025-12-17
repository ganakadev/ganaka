/*
  Warnings:

  - You are about to drop the column `shortlistSnapshotId` on the `quote_snapshots` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "quote_snapshots" DROP CONSTRAINT "quote_snapshots_shortlistSnapshotId_fkey";

-- AlterTable
ALTER TABLE "quote_snapshots" DROP COLUMN "shortlistSnapshotId";
