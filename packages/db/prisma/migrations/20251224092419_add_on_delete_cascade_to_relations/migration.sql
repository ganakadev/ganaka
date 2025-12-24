-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_runId_fkey";

-- DropForeignKey
ALTER TABLE "runs" DROP CONSTRAINT "runs_developerId_fkey";

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_runId_fkey" FOREIGN KEY ("runId") REFERENCES "runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
