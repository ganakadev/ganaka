import { FastifyReply } from "fastify";
import z from "zod";

export function validateRequest<T>(
  data: unknown,
  reply: FastifyReply,
  schema: z.ZodSchema<T>,
  type: "headers" | "params" | "query" | "body" = "body"
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `Validation failed for ${type}: ${error.issues
        .map((err) => err.path.join(".") + ": " + err.message)
        .join(", ")}`;
      // Log the validation error and the data that failed validation
      if (reply.log) {
        reply.log.error(`Validation error for ${type}: ${errorMessage}, data: ${JSON.stringify(data)}`);
      }
      reply.badRequest(errorMessage);
    } else {
      reply.internalServerError(
        "An unexpected error occurred during validation"
      );
    }
    return null;
  }
}
