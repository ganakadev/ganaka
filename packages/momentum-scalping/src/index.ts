import { ganaka } from "@ganaka-algos/sdk";
import dotenv from "dotenv";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

async function main() {
  await ganaka({
    fn: async ({ stop }) => {
      console.log("Running function");
      return "Hello, world!";
    },
    settings: {
      loopIntervalSeconds: 5,
    },
  });
}

main();
