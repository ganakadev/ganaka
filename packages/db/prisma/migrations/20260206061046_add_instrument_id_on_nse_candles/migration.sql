/*
  Warnings:

  - A unique constraint covering the columns `[instrumentId]` on the table `nse_candles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nse_candles_instrumentId_key" ON "nse_candles"("instrumentId");
