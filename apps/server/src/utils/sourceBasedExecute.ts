import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "./sendResponse";
import { AtLeastOne } from "../types/common";

export const sourceBasedExecute = ({
  request,
  sources,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
  sources: AtLeastOne<{
    dashboard?: () => Promise<ReturnType<typeof sendResponse> | undefined>;
    developer?: () => Promise<ReturnType<typeof sendResponse> | undefined>;
  }>;
}) => {
  const source = request.headers["x-source"] as "dashboard" | "developer";

  switch (source) {
    case "dashboard": {
      return sources.dashboard?.() ?? sources.developer?.();
    }
    case "developer": {
      return sources.developer?.() ?? sources.dashboard?.();
    }
    default: {
      return sources.developer?.() ?? sources.dashboard?.();
    }
  }
};
