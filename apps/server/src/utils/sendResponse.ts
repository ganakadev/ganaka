import { FastifyReply } from "fastify";
import { apiResponseSchema } from "@ganaka/schemas";

export function sendResponse<T>(reply: FastifyReply, data: T) {
  const parsed = apiResponseSchema.parse(data);
  reply.code(parsed.statusCode);
  return parsed;
}
