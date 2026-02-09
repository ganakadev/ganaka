-- DropIndex
DROP INDEX "nse_instruments_symbol_idx";

-- CreateIndex
CREATE INDEX "nse_instruments_symbol_growwSymbol_idx" ON "nse_instruments"("symbol", "growwSymbol");
