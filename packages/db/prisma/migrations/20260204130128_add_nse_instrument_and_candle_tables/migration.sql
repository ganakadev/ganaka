-- CreateTable
CREATE TABLE "nse_instruments" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nse_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nse_candles" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" BIGINT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nse_candles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nse_instruments_symbol_key" ON "nse_instruments"("symbol");

-- CreateIndex
CREATE INDEX "nse_instruments_symbol_idx" ON "nse_instruments"("symbol");

-- CreateIndex
CREATE INDEX "nse_candles_instrumentId_timestamp_idx" ON "nse_candles"("instrumentId", "timestamp");

-- AddForeignKey
ALTER TABLE "nse_candles" ADD CONSTRAINT "nse_candles_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "nse_instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
