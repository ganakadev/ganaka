# Market Data Dashboard

A Next.js application for visualizing volatile market data from the market-data-collector database. Displays shortlists (top-gainers and volume-shockers) grouped by date and time, with expandable panels showing detailed quote information for each company.

## Features

- View shortlists (Top Gainers and Volume Shockers) by date and time
- Default view shows the latest available date
- Date and time selection with MantineUI components
- Expandable company cards showing detailed quote information
- Responsive layout with MantineUI components
- Real-time data from PostgreSQL database

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma client:

```bash
pnpm prisma:generate
```

3. Set up environment variables:
   Create a `.env.local` file with:

```
DATABASE_URL=your_database_url_here
```

4. Run the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (DateTimeSelector, ShortlistCard, QuotePanel, CompanyCard)
- `src/lib/` - Prisma client setup
- `src/types/` - TypeScript type definitions
- `prisma/` - Prisma schema (symlinked from market-data-collector)

## API Routes

- `GET /api/shortlists?date=&type=` - Fetch shortlists by date and type
- `GET /api/quotes?nseSymbol=&timestamp=&shortlistType=` - Fetch quote details

## Technologies

- Next.js 15 (App Router)
- React 18
- TypeScript
- MantineUI (Core, Dates, Hooks, Charts)
- Prisma
- PostgreSQL
