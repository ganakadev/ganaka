# API Tests

This directory contains Playwright API tests for the server endpoints.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Ensure the server is built:
```bash
pnpm build
```

3. Set up test database:
   - Make sure `DATABASE_URL` environment variable points to a test database
   - The tests will automatically clean up and seed the database

## Running Tests

Run all tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run specific test file:
```bash
pnpm test tests/api/admin/developers.test.ts
```

## Test Structure

- `tests/api/admin/` - Admin route tests
- `tests/helpers/` - Test utilities (auth, db, setup)
- `tests/fixtures/` - Test data generators

## Environment Variables

- `TEST_API_URL` - Base URL for the test server (default: http://localhost:4000)
- `TEST_PORT` - Port for the test server (default: 4000)
- `TEST_ADMIN_TOKEN` - Admin token (set automatically by global setup)

## Test Database

The tests use a separate test database. Make sure to:
- Use a different `DATABASE_URL` for tests
- The database will be cleaned up before each test run
- Admin user is automatically created during setup

## Notes

- Tests automatically start/stop the server
- Database is cleaned before each test run
- Admin user is seeded automatically

