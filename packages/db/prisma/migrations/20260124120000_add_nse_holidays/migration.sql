-- CreateTable
CREATE TABLE "nse_holidays" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nse_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nse_holidays_date_key" ON "nse_holidays"("date");

-- CreateIndex
CREATE INDEX "nse_holidays_date_idx" ON "nse_holidays"("date");
