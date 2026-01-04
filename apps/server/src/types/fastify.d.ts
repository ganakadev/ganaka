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
  }
}

