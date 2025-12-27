# Ganaka SDK

TypeScript/JavaScript client library for the Ganaka trading platform.

## Installation

This package is published to GitHub Packages. To install it, you need to configure npm to authenticate with GitHub Packages.

### 1. Create or update `.npmrc` file

Create an `.npmrc` file in your project root (or in your home directory for global configuration) with the following content:

```
@ganaka:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with a GitHub Personal Access Token (PAT) that has `read:packages` permission.

### 2. Install the package

```bash
npm install @ganaka/sdk
# or
yarn add @ganaka/sdk
# or
pnpm add @ganaka/sdk
```

### Getting a GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `read:packages` scope
3. Use this token in your `.npmrc` file

**Note:** For CI/CD environments, use the `GITHUB_TOKEN` secret provided by GitHub Actions, or create a PAT and store it as a secret.

### Alternative: Using environment variable

You can also set the token as an environment variable:

```bash
export NPM_TOKEN=your_github_token
```

Then create `.npmrc`:
```
@ganaka:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

## Quick Start

```typescript
import { GanakaClient } from "@ganaka/sdk";

// Initialize the client
const client = new GanakaClient({
  apiKey: "your-api-key",
  baseUrl: "https://api.ganaka.com",
  debug: true,
});

// Check API health
const health = await client.health();
console.log(health);

// Get shortlists
const shortlists = await client.getShortlists();
if (shortlists.success) {
  console.log("Shortlists:", shortlists.data);
}
```

## Configuration

```typescript
const client = new GanakaClient({
  apiKey: "your-api-key", // API key for authentication
  baseUrl: "http://localhost:3000", // API base URL
  wsUrl: "ws://localhost:3000", // WebSocket URL for real-time data
  timeout: 30000, // Request timeout in milliseconds
  debug: false, // Enable debug logging
});
```

## API Methods

### Shortlists

```typescript
// Get all shortlists
const shortlists = await client.getShortlists();

// Get a specific shortlist
const shortlist = await client.getShortlist("shortlist-id");

// Create a new shortlist
const newShortlist = await client.createShortlist({
  name: "My Watchlist",
  symbols: ["AAPL", "GOOGL", "MSFT"],
});

// Update a shortlist
const updated = await client.updateShortlist("shortlist-id", {
  name: "Updated Watchlist",
});

// Delete a shortlist
await client.deleteShortlist("shortlist-id");
```

### Instruments

```typescript
// Search instruments
const results = await client.searchInstruments("apple");

// Get instrument details
const instrument = await client.getInstrument("AAPL");

// Get multiple instruments
const instruments = await client.getInstruments(["AAPL", "GOOGL"]);
```

### Strategies

```typescript
// Get all strategies
const strategies = await client.getStrategies();

// Create a strategy
const strategy = await client.createStrategy({
  name: "My Strategy",
  type: "momentum",
  parameters: {
    period: 20,
    threshold: 0.02,
  },
  status: "inactive",
});

// Start/stop a strategy
await client.startStrategy("strategy-id");
await client.stopStrategy("strategy-id");
```

### Orders

```typescript
// Place an order
const order = await client.placeOrder({
  symbol: "AAPL",
  quantity: 100,
  orderType: "market",
  side: "buy",
});

// Get orders
const orders = await client.getOrders();

// Cancel an order
await client.cancelOrder("order-id");
```

## WebSocket - Real-time Data

```typescript
// Get WebSocket client
const ws = client.getWebSocket();

// Connect to WebSocket
await client.connectWebSocket();

// Subscribe to events
ws.on("connected", () => {
  console.log("Connected to real-time data");
});

ws.on("tick", (data) => {
  console.log("Tick data:", data);
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Subscribe to tick data for symbols
ws.subscribeTicks(["AAPL", "GOOGL"]);

// Unsubscribe
ws.unsubscribeTicks(["AAPL"]);

// Disconnect
client.disconnectWebSocket();
```

## Error Handling

All API methods return an `ApiResponse` object with the following structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

Example error handling:

```typescript
const response = await client.getShortlists();

if (response.success) {
  console.log("Data:", response.data);
} else {
  console.error("Error:", response.error);
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions:

```typescript
import type { Shortlist, Instrument, Order, Strategy, User } from "@ganaka/sdk";
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

The package is automatically published to GitHub Packages when a git tag is created. The workflow triggers on tags matching `sdk/v*` or `v*` patterns.

To manually publish (requires authentication):

```bash
# Build before publishing
pnpm run build

# Configure npm registry (if not already done)
echo "@ganaka:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc

# Publish to GitHub Packages
pnpm publish
```

**Note:** Publishing requires a GitHub Personal Access Token with `write:packages` permission.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.




















