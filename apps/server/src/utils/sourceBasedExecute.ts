import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "./sendResponse";
import { AtLeastOne } from "../types/common";

export const sourceBasedExecute = ({
  request,
  sources,
  reply,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
  sources: AtLeastOne<{
    dashboard?: () => Promise<ReturnType<typeof sendResponse> | undefined>;
    developer?: () => Promise<ReturnType<typeof sendResponse> | undefined>;
  }>;
}) => {
  const source = (request.headers["x-source"] as "dashboard" | "developer") ?? "developer";

  switch (source) {
    case "dashboard": {
      return sources.dashboard?.();
    }
    case "developer": {
      return sources.developer?.();
    }
    default: {
      return reply.badRequest("Invalid source. Please check your request headers.");
    }
  }
};
