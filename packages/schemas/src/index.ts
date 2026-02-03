/**
 * @ganaka/apiTypes
 * Shared API types and schemas for Ganaka platform
 *
 * This package provides type-safe API contracts using Zod schemas.
 */

// Re-export new flat structure schemas
import * as v1_schemas from "./v1";

// Re-export common types
export * from "./common";

// Export new flat structure
export { v1_schemas };

// Export new flat structure
export {
  // Individual exports for convenience
  v1_auth_schemas,
  v1_candles_schemas,
  v1_dates_schemas,
  v1_developers_schemas,
  v1_groww_credentials_schemas,
  v1_groww_token_schemas,
  v1_holidays_schemas,
  v1_lists_schemas,
  v1_quote_schemas,
  v1_runs_schemas,
} from "./v1";
