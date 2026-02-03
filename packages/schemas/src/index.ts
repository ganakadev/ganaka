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
export {
  v1_schemas,
  // Individual exports for convenience
  v1_auth_schemas,
  v1_candles_schemas,
  v1_dates_schemas,
  v1_developers_schemas,
  v1_groww_credentials_schemas,
  v1_groww_token_schemas,
  v1_holidays_schemas,
  v1_lists_schemas,
  v1_nifty_schemas,
  v1_quote_schemas,
  v1_runs_schemas,
} from "./v1";

// Legacy exports (deprecated - kept for backward compatibility during migration)
import * as v1_developer_candles_schemas from "./v1/developer/candles/candles";
import * as v1_developer_collector_schemas from "./v1/developer/collector/collector";
import * as v1_developer_collector_holidays_schemas from "./v1/developer/collector/holidays/holidays";
import * as v1_developer_dates_schemas from "./v1/developer/dates/dates";
import * as v1_developer_groww_token_schemas from "./v1/developer/groww/token/token";
import * as v1_developer_holidays_schemas from "./v1/developer/holidays/holidays";
import * as v1_developer_lists_schemas from "./v1/developer/lists/lists";
import * as v1_developer_lists_persistence_schemas from "./v1/developer/lists/persistence";
import * as v1_developer_nifty_schemas from "./v1/developer/nifty/nifty";
import * as v1_developer_quote_schemas from "./v1/developer/quote/quote";
import * as v1_dashboard_schemas from "./v1/dashboard";
import * as v1_admin_schemas from "./v1/admin";

export { v1_developer_candles_schemas };
export { v1_developer_collector_schemas };
export { v1_developer_collector_holidays_schemas };
export { v1_developer_dates_schemas };
export { v1_developer_groww_token_schemas };
export { v1_developer_holidays_schemas };
export { v1_developer_lists_schemas };
export { v1_developer_lists_persistence_schemas };
export { v1_developer_nifty_schemas };
export { v1_developer_quote_schemas };
export { v1_dashboard_schemas };
export { v1_admin_schemas };
