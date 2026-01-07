-- AlterTable
ALTER TABLE "runs" ADD COLUMN     "name" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

