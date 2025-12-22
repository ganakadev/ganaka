-- AlterTable
ALTER TABLE "developer_tokens" ADD COLUMN     "id" TEXT;

-- CreateTable
CREATE TABLE "collector_errors" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "errorStack" TEXT,
    "errorContext" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collector_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collector_errors_timestamp_idx" ON "collector_errors"("timestamp");
