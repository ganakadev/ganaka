import { apiResponseSchema } from "@ganaka/schemas";

export function sendResponse<T>(data: T) {
  return apiResponseSchema.parse(data);
}
