/**
 * @ganaka/apiTypes
 * Shared API types and schemas for Ganaka platform
 *
 * This package provides type-safe API contracts using Zod schemas.
 */

// Re-export developer groww endpoint schemas
export * as v1_developer_collector_schemas from "./v1/developer/collector/collector";
export * as v1_developer_groww_schemas from "./v1/developer/groww/groww";
export * as v1_developer_lists_schemas from "./v1/developer/lists/lists";

// Re-export dashboard endpoint schemas
export * as v1_dashboard_schemas from "./v1/dashboard";

// Re-export admin endpoint schemas
export * as v1_admin_schemas from "./v1/admin";

// Re-export common types
export * from "./common";
