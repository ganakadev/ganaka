import { FastifyReply } from "fastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Validates that all requested datetimes are strictly before the current timestamp.
 * Throws a 403 Forbidden error if any datetime is >= currentTimestamp.
 *
 * @param currentTimestamp - The current execution timestamp
 * @param requestedDatetimes - Array of datetimes to validate
 * @param reply - Fastify reply object for error responses
 * @throws Error if validation fails (returns 403 via reply)
 */
export function validateCurrentTimestamp(
  currentTimestamp: Date,
  requestedDatetimes: Date[],
  reply: FastifyReply
): void {
  for (const requestedDatetime of requestedDatetimes) {
    if (dayjs.utc(requestedDatetime).isAfter(dayjs.utc(currentTimestamp))) {
      const errorMessage = `Cannot access data at ${requestedDatetime.toISOString()}. Data must be before current execution timestamp (${currentTimestamp.toISOString()})`;
      reply.code(403).send({
        statusCode: 403,
        message: errorMessage,
        error: "Forbidden",
      });
      throw new Error(errorMessage);
    }
  }
}
