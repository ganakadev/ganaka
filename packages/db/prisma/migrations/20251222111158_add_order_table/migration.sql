-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "nseSymbol" TEXT NOT NULL,
    "stopLossPrice" DECIMAL(65,30) NOT NULL,
    "takeProfitPrice" DECIMAL(65,30) NOT NULL,
    "entryPrice" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "runId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_runId_key" ON "orders"("runId");

-- CreateIndex
CREATE INDEX "orders_runId_username_idx" ON "orders"("runId", "username");
