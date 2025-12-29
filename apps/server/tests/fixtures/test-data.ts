import { faker } from "@faker-js/faker";

/**
 * Generates a random username for testing
 */
export function generateUsername(): string {
  return `test-user-${faker.string.alphanumeric(8)}`;
}

/**
 * Generates a valid UUID for testing
 */
export function generateUUID(): string {
  return "dddddddd-dddd-dddd-dddd-dddddddddddd";
}

/**
 * Creates test data for creating a developer
 */
export function createDeveloperTestData() {
  return {
    username: generateUsername(),
  };
}

/**
 * Creates test data with invalid username (too long)
 */
export function createInvalidDeveloperTestData() {
  return {
    username: "a".repeat(256), // Exceeds max length of 255
  };
}

/**
 * Creates test data with empty username
 */
export function createEmptyDeveloperTestData() {
  return {
    username: "",
  };
}
