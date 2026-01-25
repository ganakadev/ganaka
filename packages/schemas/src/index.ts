/**
 * @ganaka/apiTypes
 * Shared API types and schemas for Ganaka platform
 *
 * This package provides type-safe API contracts using Zod schemas.
 */

// Re-export developer groww endpoint schemas
import * as v1_developer_collector_schemas from "./v1/developer/collector/collector";
import * as v1_developer_groww_schemas from "./v1/developer/groww/groww";
import * as v1_developer_lists_schemas from "./v1/developer/lists/lists";
import * as v1_developer_shortlist_persistence_schemas from "./v1/developer/shortlist-persistence";
import * as v1_developer_available_dates_schemas from "./v1/developer/available-dates";
import * as v1_developer_holidays_schemas from "./v1/developer/holidays";

// Re-export dashboard endpoint schemas
import * as v1_dashboard_schemas from "./v1/dashboard";

// Re-export admin endpoint schemas
import * as v1_admin_schemas from "./v1/admin";

// Re-export common types
export * from "./common";

export { v1_developer_collector_schemas };
export { v1_developer_groww_schemas };
export { v1_developer_lists_schemas };
export { v1_developer_shortlist_persistence_schemas };
export { v1_developer_available_dates_schemas };
export { v1_developer_holidays_schemas };
export { v1_dashboard_schemas };
export { v1_admin_schemas };
