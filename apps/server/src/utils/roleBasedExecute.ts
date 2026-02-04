import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "./sendResponse";
import { AtLeastOne } from "../types/common";

export const roleBasedExecute = ({
  request,
  reply,
  roles,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
  roles: AtLeastOne<{
    admin?: () => Promise<ReturnType<typeof sendResponse> | undefined>;
    developer?: () => Promise<ReturnType<typeof sendResponse> | undefined>;
  }>;
}) => {
  const userRole = request.admin ? "admin" : "developer";

  switch (userRole) {
    case "admin": {
      return roles.admin?.() ?? roles.developer?.();
    }
    case "developer": {
      if (!roles.developer) {
        if (roles.admin) {
          return reply.unauthorized(
            "Authorization failed for this user request. Please check your credentials and try again."
          );
        }
      } else {
        return roles.developer?.();
      }
    }
    default:
      return reply.badRequest("Invalid user role. Please check your developer token..");
  }
};
