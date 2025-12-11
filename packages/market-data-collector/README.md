# Market Data Collector

A service that collects market data (shortlists and quotes) every minute during market hours and stores it in Neon PostgreSQL via Prisma for backtesting purposes.

## Overview

This service:
- Fetches both "top-gainers" and "volume-shockers" shortlists
- Limits to top 10 from each list
- Fetches quotes for all unique symbols with rate limiting (10 calls/second)
- Fetches NIFTYBANK quote for trend analysis
- Stores all data in PostgreSQL with JSON fields for flexibility

## Collection Window

- **Start**: 8:45 AM IST
- **End**: 3:30 PM IST
- Service exits gracefully if invoked outside this window

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
DATABASE_URL=your_neon_postgresql_connection_string
GROWW_API_KEY=your_groww_api_key
GROWW_API_SECRET=your_groww_api_secret
```

3. Generate Prisma client:
```bash
pnpm prisma:generate
```

4. Run migrations:
```bash
pnpm prisma:migrate
```

## Usage

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

## Database Schema

- **ShortlistSnapshot**: Stores shortlist data (top-gainers and volume-shockers)
- **QuoteSnapshot**: Stores quote data for each symbol
- **NiftybankQuote**: Stores NIFTYBANK quote data for trend analysis

All tables use JSON fields to store complete API responses for maximum flexibility.

## Deployment

Configure Render.com cron job to invoke this service every minute:
- Schedule: `* * * * *` (every minute)
- Command: `node dist/index.js`
- The service will automatically check if it's within the collection window

## Rate Limiting

The service respects Groww API rate limits by:
- Batching quote requests into groups of 10
- Waiting 1 second between batches
- Fetching quotes in parallel within each batch for accuracy
