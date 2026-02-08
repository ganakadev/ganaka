import axios from "axios";
import { parse } from "csv-parse/sync";
import { prisma } from "../utils/prisma";
import type { NseIntrument } from "@ganaka/db";

export interface InstrumentFromCSV {
  symbol: string; // from trading_symbol column
  growwSymbol: string; // from groww_symbol column
  name: string; // from name column
}

/**
 * Fetch instruments CSV from Groww and parse it
 */
export const fetchInstrumentsFromCSV = async (): Promise<InstrumentFromCSV[]> => {
  const csvUrl = "https://growwapi-assets.groww.in/instruments/instrument.csv";

  console.log(`Fetching instruments from ${csvUrl}...`);
  const response = await axios.get(csvUrl, {
    timeout: 30000, // 30 second timeout
    responseType: "text", // Ensure we get text, not JSON
  });

  const csvText = response.data as string;

  if (!csvText || csvText.trim().length === 0) {
    throw new Error("CSV file appears to be empty or invalid");
  }

  // Parse CSV with csv-parse (optimized for large files)
  const records = parse(csvText, {
    columns: true, // Use first line as column names
    skip_empty_lines: true,
    trim: true,
    cast: false, // Keep values as strings for performance
    bom: true, // Handle BOM if present
    relax_column_count: true, // Handle rows with varying column counts gracefully
  }) as Record<string, string>[];

  if (records.length === 0) {
    throw new Error("CSV file contains no data rows");
  }

  // Validate required columns exist
  const firstRecord = records[0];
  const requiredColumns = ["trading_symbol", "groww_symbol", "name", "instrument_type", "series"];
  const missingColumns = requiredColumns.filter((col) => !(col in firstRecord));

  if (missingColumns.length > 0) {
    throw new Error(
      `CSV file missing required columns: ${missingColumns.join(", ")}. Expected: ${requiredColumns.join(", ")}`
    );
  }

  const instruments: InstrumentFromCSV[] = [];

  // Filter and transform records
  for (const record of records) {
    const instrumentType = record.instrument_type?.trim();
    const series = record.series?.trim();

    // Filter: instrument_type === "EQ" && series === "EQ"
    if (instrumentType === "EQ" && series === "EQ") {
      const symbol = record.trading_symbol?.trim();
      const growwSymbol = record.groww_symbol?.trim();
      const name = record.name?.trim();

      if (symbol && growwSymbol && name) {
        instruments.push({
          symbol,
          growwSymbol,
          name,
        });
      }
    }
  }

  console.log(`Parsed ${instruments.length} equity instruments from CSV`);
  return instruments;
};

/**
 * Sync instruments to database, adding new ones
 */
export const syncInstrumentsToDb = async (
  instruments: InstrumentFromCSV[]
): Promise<{ newInstruments: NseIntrument[]; existingCount: number }> => {
  // Get all existing symbols from DB
  const existingInstruments = await prisma.nseIntrument.findMany({
    select: {
      symbol: true,
    },
  });

  const existingSymbols = new Set(existingInstruments.map((inst) => inst.symbol));

  // Find new instruments (in CSV but not in DB)
  const newInstruments = instruments.filter((inst) => !existingSymbols.has(inst.symbol));

  if (newInstruments.length === 0) {
    console.log("No new instruments to add");
    return {
      newInstruments: [],
      existingCount: existingInstruments.length,
    };
  }

  console.log(`Adding ${newInstruments.length} new instruments to database...`);

  // Bulk insert new instruments
  await prisma.nseIntrument.createMany({
    data: newInstruments.map((inst) => ({
      symbol: inst.symbol,
      growwSymbol: inst.growwSymbol,
      name: inst.name,
    })),
    skipDuplicates: true,
  });

  // Fetch the newly created instruments for return
  const createdInstruments = await prisma.nseIntrument.findMany({
    where: {
      symbol: {
        in: newInstruments.map((inst) => inst.symbol),
      },
    },
  });

  return {
    newInstruments: createdInstruments,
    existingCount: existingInstruments.length,
  };
};
