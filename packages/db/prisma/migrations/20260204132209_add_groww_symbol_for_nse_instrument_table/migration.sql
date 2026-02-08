/*
  Warnings:

  - A unique constraint covering the columns `[growwSymbol]` on the table `nse_instruments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `growwSymbol` to the `nse_instruments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nse_instruments" ADD COLUMN     "growwSymbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "nse_instruments_growwSymbol_key" ON "nse_instruments"("growwSymbol");
