/*
  Warnings:

  - Added the required column `updatedAt` to the `developer_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `nifty_quotes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortlistSnapshotId` to the `quote_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `quote_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `shortlist_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "developer_tokens" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "developer_tokens_pkey" PRIMARY KEY ("username");

-- AlterTable
ALTER TABLE "nifty_quotes" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "dayChangePerc" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quote_snapshots" ADD COLUMN     "shortlistSnapshotId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "shortlist_snapshots" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "quote_snapshots" ADD CONSTRAINT "quote_snapshots_shortlistSnapshotId_fkey" FOREIGN KEY ("shortlistSnapshotId") REFERENCES "shortlist_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
