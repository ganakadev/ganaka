-- CreateTable
CREATE TABLE "runs" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "runs_startTime_endTime_completed_idx" ON "runs"("startTime", "endTime", "completed");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_runId_fkey" FOREIGN KEY ("runId") REFERENCES "runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
