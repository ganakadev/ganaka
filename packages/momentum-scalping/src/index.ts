import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

async function main() {
  console.log("Hello from TypeScript Node.js app!");

  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    console.log("Sample API response:", response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

main();
