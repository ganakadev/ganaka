-- CreateEnum (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ShortlistType') THEN
        CREATE TYPE "ShortlistType" AS ENUM ('TOP_GAINERS', 'VOLUME_SHOCKERS');
    END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "shortlist_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "shortlistType" "ShortlistType" NOT NULL,
    "entries" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shortlist_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "quote_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "nseSymbol" TEXT NOT NULL,
    "shortlistType" "ShortlistType" NOT NULL,
    "quoteData" JSONB NOT NULL,
    "buyerControlPercentage" DECIMAL(5,2),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "nifty_quotes" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "quoteData" JSONB NOT NULL,
    "dayChangePerc" DECIMAL(10,4) NOT NULL,
    "isBullish" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nifty_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "shortlist_snapshots_timestamp_idx" ON "shortlist_snapshots"("timestamp");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "quote_snapshots_timestamp_idx" ON "quote_snapshots"("timestamp");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "quote_snapshots_nseSymbol_idx" ON "quote_snapshots"("nseSymbol");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "quote_snapshots_timestamp_nseSymbol_idx" ON "quote_snapshots"("timestamp", "nseSymbol");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "nifty_quotes_timestamp_idx" ON "nifty_quotes"("timestamp");
