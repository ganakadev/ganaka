import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    developer?: {
      id: string;
      username: string;
      token: string;
    };
    admin?: {
      id: string;
      username: string;
      token: string;
    };
    runId?: string;
    // used to time block the data being sent back (for backtesting)
    currentTimestamp?: Date;
    // timezone for the current timestamp
    currentTimezone?: string;
  }
}
