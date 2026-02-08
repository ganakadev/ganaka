/*
  Warnings:

  - The primary key for the `nse_candles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `nse_candles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `nse_candles` table. All the data in the column will be lost.
  - The `id` column on the `nse_candles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `nse_instruments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `nse_instruments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `instrumentId` on the `nse_candles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "nse_candles" DROP CONSTRAINT "nse_candles_instrumentId_fkey";

-- AlterTable
ALTER TABLE "nse_candles" DROP CONSTRAINT "nse_candles_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "instrumentId",
ADD COLUMN     "instrumentId" INTEGER NOT NULL,
ADD CONSTRAINT "nse_candles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nse_instruments" DROP CONSTRAINT "nse_instruments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "nse_instruments_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "nse_candles_instrumentId_timestamp_idx" ON "nse_candles"("instrumentId", "timestamp");

-- AddForeignKey
ALTER TABLE "nse_candles" ADD CONSTRAINT "nse_candles_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "nse_instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
