import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "./prisma";

export const authenticator = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // fetch bearer token from headers
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      reply.status(401).send({
        error: "Please authenticate this request using your developer token",
      });
      return false;
    }

    const developerToken = await prisma.developerToken.findUnique({
      where: { token },
    });
    if (!developerToken) {
      reply.status(401).send({
        error:
          "Developer token invalid or expired. Please contact administrator.",
      });
      return false;
    }

    return true;
  } catch (error) {
    reply.status(500).send({
      error: "An unexpected error occurred. Please try again later.",
    });
    return false;
  }
};
