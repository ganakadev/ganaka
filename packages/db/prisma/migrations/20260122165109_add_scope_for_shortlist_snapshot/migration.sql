-- CreateEnum
CREATE TYPE "ShortlistScope" AS ENUM ('FULL', 'TOP_5');

-- AlterTable
ALTER TABLE "shortlist_snapshots" ADD COLUMN     "scope" "ShortlistScope" NOT NULL DEFAULT 'TOP_5';
