import { FastifyReply } from "fastify";
import z from "zod";

export function validateRequest<T>(
  data: unknown,
  reply: FastifyReply,
  schema: z.ZodSchema<T>,
  type: "headers" | "params" | "query" | "body" = "body"
): T | null {
  try {
    const result = schema.parse(data);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Limit to first 5 validation errors to prevent huge error messages
      const maxErrors = 5;
      const displayedIssues = error.issues.slice(0, maxErrors);
      const errorMessage = `Validation failed for ${type}: ${displayedIssues
        .map((err) => err.path.join(".") + ": " + err.message)
        .join(", ")}${
        error.issues.length > maxErrors
          ? ` (and ${error.issues.length - maxErrors} more errors)`
          : ""
      }`;
      // Log the validation error and the data that failed validation
      if (reply.log) {
        reply.log.error(
          `Validation error for ${type}: ${errorMessage}, data: ${JSON.stringify(data)}`
        );
      }
      reply.badRequest(errorMessage);
    } else {
      reply.internalServerError("An unexpected error occurred during validation");
    }
    return null;
  }
}
