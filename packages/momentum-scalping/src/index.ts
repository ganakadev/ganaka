import { ganaka } from "@ganaka-algos/sdk";
import dotenv from "dotenv";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

interface GainerWithDepth {
  name: string;
  price: number;
  groww_symbol: string;
  buyDepth: number;
  sellDepth: number;
  depthDifference: number;
}

async function main() {
  await ganaka({
    fn: async ({ getGrowwTopGainers, getGrowwQuote }) => {
      const topGainers = await getGrowwTopGainers();
      console.log(topGainers);
    },
    settings: {
      loopIntervalSeconds: 5,
    },
  });
}

main();
