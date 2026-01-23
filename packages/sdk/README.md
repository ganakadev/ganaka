# Ganaka SDK

TypeScript/JavaScript client library for the Ganaka trading platform.

## Installation

Install the package using your preferred package manager:

```bash
npm install @ganaka/sdk
# or
yarn add @ganaka/sdk
# or
pnpm add @ganaka/sdk
```

## Quick Start

### Using GanakaClient for Standalone API Calls

The `GanakaClient` allows you to fetch data without setting up a full ganaka run:

```typescript
import { GanakaClient } from "@ganaka/sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize the client (reads DEVELOPER_KEY from environment)
const client = new GanakaClient();

// Or with explicit configuration
const client = new GanakaClient({
  developerToken: "your-developer-token",
  apiDomain: "https://api.ganaka.live", // optional, defaults to this
});

// Fetch historical candles
const candles = await client.fetchCandles({
  symbol: "RELIANCE",
  interval: "1minute",
  start_datetime: "2026-01-20T09:15:00",
  end_datetime: "2026-01-20T15:30:00",
});

// Fetch quote for a symbol
const quote = await client.fetchQuote({
  symbol: "RELIANCE",
  datetime: "2026-01-20T10:30:00",
});

// Fetch shortlist
const shortlist = await client.fetchShortlist({
  type: "top-gainers",
  datetime: "2026-01-20T10:30:00",
});
```

### Using ganaka() for Iterative Strategies

The `ganaka()` function is used for running iterative strategies with time loops:

```typescript
import { ganaka } from "@ganaka/sdk";
import dotenv from "dotenv";

dotenv.config();

await ganaka({
  fn: async ({ fetchCandles, fetchQuote, placeOrder, currentTimestamp }) => {
    // Your strategy logic here
    const candles = await fetchCandles({
      symbol: "RELIANCE",
      interval: "1minute",
      start_datetime: "2026-01-20T09:15:00",
      end_datetime: currentTimestamp,
    });

    const quote = await fetchQuote({
      symbol: "RELIANCE",
      datetime: currentTimestamp,
    });

    // Place order if conditions are met
    if (quote && quote.price > 100) {
      await placeOrder({
        nseSymbol: "RELIANCE",
        entryPrice: quote.price,
        stopLossPrice: quote.price * 0.95,
        takeProfitPrice: quote.price * 1.05,
        datetime: currentTimestamp,
      });
    }
  },
  startTime: "2026-01-20T09:15:00",
  endTime: "2026-01-20T15:30:00",
  intervalMinutes: 1,
  name: "My Strategy",
  tags: ["momentum", "scalping"],
});
```

## Configuration

### Environment Variables

The SDK reads configuration from environment variables:

- `DEVELOPER_KEY` - Your developer token (required)
- `API_DOMAIN` - API base URL (optional, defaults to `https://api.ganaka.live`)

### GanakaClient Configuration

```typescript
import { GanakaClient } from "@ganaka/sdk";

const client = new GanakaClient({
  developerToken: "your-developer-token", // optional if DEVELOPER_KEY env var is set
  apiDomain: "https://api.ganaka.live", // optional, defaults to this
});
```

## API Methods

### GanakaClient Methods

All methods return promises that resolve to the API response data.

#### `fetchCandles(params)`

Fetch historical candles for a symbol.

```typescript
const candles = await client.fetchCandles({
  symbol: "RELIANCE",
  interval: "1minute", // or "5minute", "1day", etc.
  start_datetime: "2026-01-20T09:15:00", // IST format (YYYY-MM-DDTHH:mm:ss)
  end_datetime: "2026-01-20T15:30:00",
});
```

#### `fetchQuote(params)`

Fetch quote for a symbol at a specific datetime.

```typescript
const quote = await client.fetchQuote({
  symbol: "RELIANCE",
  datetime: "2026-01-20T10:30:00", // IST format
});
```

#### `fetchQuoteTimeline(symbol, end_datetime)`

Fetch quote timeline for a symbol.

```typescript
const timeline = await client.fetchQuoteTimeline(
  "RELIANCE",
  "2026-01-20T15:30:00" // IST format
);
```

#### `fetchNiftyQuote(params)`

Fetch NIFTY quote at a specific datetime.

```typescript
const niftyQuote = await client.fetchNiftyQuote({
  datetime: "2026-01-20T10:30:00", // IST format
});
```

#### `fetchNiftyQuoteTimeline(end_datetime)`

Fetch NIFTY quote timeline.

```typescript
const niftyTimeline = await client.fetchNiftyQuoteTimeline(
  "2026-01-20T15:30:00" // IST format
);
```

#### `fetchShortlist(queryParams)`

Fetch shortlist for a specific type and datetime.

```typescript
const shortlist = await client.fetchShortlist({
  type: "top-gainers", // or "top-losers", etc.
  datetime: "2026-01-20T10:30:00", // IST format
});
```

#### `fetchShortlistPersistence(queryParams)`

Fetch shortlist persistence - stocks that consistently appeared in a shortlist over a time range.

```typescript
const persistence = await client.fetchShortlistPersistence({
  type: "top-gainers",
  start_datetime: "2026-01-20T09:15:00", // IST format
  end_datetime: "2026-01-20T15:30:00", // IST format
});
```

### ganaka() Function

The `ganaka()` function provides a `RunContext` with all the above methods plus:

- `placeOrder(data)` - Place an order (only available within a run context)
- `currentTimestamp` - Current timestamp in IST format for the current loop iteration

## Error Handling

All methods throw errors if the API request fails. Handle them with try-catch:

```typescript
try {
  const candles = await client.fetchCandles({
    symbol: "RELIANCE",
    interval: "1minute",
    start_datetime: "2026-01-20T09:15:00",
    end_datetime: "2026-01-20T15:30:00",
  });
  console.log("Candles:", candles);
} catch (error) {
  if (error instanceof Error) {
    console.error("Failed to fetch candles:", error.message);
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  GanakaClient,
  GanakaClientConfig,
  FetchCandlesResponse,
  FetchQuoteResponse,
  FetchShortlistResponse,
  RunContext,
} from "@ganaka/sdk";
```

## Development

### Building

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run build

# Watch mode
pnpm run dev

# Type checking
pnpm run lint
```

### Publishing

To publish a new version to npm:

```bash
# Build before publishing
pnpm run build

# Login to npm (if not already logged in)
npm login

# Publish to npm
npm publish
```

**Note:** 
- You must be a member of the `ganaka` organization on npm to publish
- The package will be published as `@ganaka/sdk` to the public npm registry
- Ensure you have the correct version number in `package.json` before publishing

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
