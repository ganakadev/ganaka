/**
 * @ganaka/apiTypes
 * Shared API types and schemas for Ganaka platform
 *
 * This package provides type-safe API contracts using Zod schemas.
 */

// Re-export developer endpoint schemas
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

// Re-export dashboard endpoint schemas
import * as v1_dashboard_schemas from "./v1/dashboard";

// Re-export admin endpoint schemas
import * as v1_admin_schemas from "./v1/admin";

// Re-export common types
export * from "./common";

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
