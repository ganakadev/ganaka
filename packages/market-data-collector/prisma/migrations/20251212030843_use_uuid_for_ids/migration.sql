/*
  Warnings:

  - The primary key for the `nifty_quotes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `quote_snapshots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `shortlist_snapshots` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "nifty_quotes" DROP CONSTRAINT "nifty_quotes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "nifty_quotes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "nifty_quotes_id_seq";

-- AlterTable
ALTER TABLE "quote_snapshots" DROP CONSTRAINT "quote_snapshots_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "quote_snapshots_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "quote_snapshots_id_seq";

-- AlterTable
ALTER TABLE "shortlist_snapshots" DROP CONSTRAINT "shortlist_snapshots_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "shortlist_snapshots_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "shortlist_snapshots_id_seq";
