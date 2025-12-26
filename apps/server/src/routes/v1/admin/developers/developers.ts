import { FastifyPluginAsync } from "fastify";
import { validateRequest } from "../../../../utils/validator";
import { v1_admin_schemas } from "@ganaka/schemas";
import { sendResponse } from "../../../../utils/sendResponse";
import { prisma } from "../../../../utils/prisma";
import z from "zod";
import { randomUUID } from "crypto";

const developersRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /developers ====================

  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_admin_schemas.v1_admin_developers_schemas.getDevelopers.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { limit, offset } = validationResult;

      const [developers, total] = await Promise.all([
        prisma.developer.findMany({
          take: limit,
          skip: offset,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.developer.count(),
      ]);

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_developers_schemas.getDevelopers.response
        >
      >({
        statusCode: 200,
        message: "Developers fetched successfully",
        data: {
          developers,
          total,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching developers: %s", error);
      return reply.internalServerError(
        "Failed to fetch developers. Please check server logs for more details."
      );
    }
  });

  // ==================== GET /developers/:id ====================

  fastify.get("/:id", async (request, reply) => {
    const validationResult = validateRequest(
      request.params,
      reply,
      v1_admin_schemas.v1_admin_developers_schemas.getDeveloper.params,
      "params"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { id } = validationResult;

      const developer = await prisma.developer.findUnique({
        where: { id },
      });

      if (!developer) {
        return reply.notFound("Developer not found");
      }

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_developers_schemas.getDeveloper.response
        >
      >({
        statusCode: 200,
        message: "Developer fetched successfully",
        data: developer,
      });
    } catch (error) {
      fastify.log.error("Error fetching developer: %s", error);
      return reply.internalServerError(
        "Failed to fetch developer. Please check server logs for more details."
      );
    }
  });

  // ==================== POST /developers ====================

  fastify.post("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_admin_schemas.v1_admin_developers_schemas.createDeveloper.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { username } = validationResult;

      // Check if username already exists
      const existingDeveloper = await prisma.developer.findUnique({
        where: { username },
      });

      if (existingDeveloper) {
        return reply.conflict("Username already exists");
      }

      // Generate UUIDs for id and token
      const id = randomUUID();
      const token = randomUUID();

      const developer = await prisma.developer.create({
        data: {
          id,
          username,
          token,
        },
      });

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_developers_schemas.createDeveloper.response
        >
      >({
        statusCode: 201,
        message: "Developer created successfully",
        data: developer,
      });
    } catch (error) {
      fastify.log.error("Error creating developer: %s", error);

      // Handle Prisma unique constraint errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return reply.conflict("Username already exists");
      }

      return reply.internalServerError(
        "Failed to create developer. Please check server logs for more details."
      );
    }
  });

  // ==================== PATCH /developers/:id/refresh-key ====================

  fastify.patch("/:id/refresh-key", async (request, reply) => {
    const validationResult = validateRequest(
      request.params,
      reply,
      v1_admin_schemas.v1_admin_developers_schemas.refreshDeveloperKey.params,
      "params"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { id } = validationResult;

      // Check if developer exists
      const existingDeveloper = await prisma.developer.findUnique({
        where: { id },
      });

      if (!existingDeveloper) {
        return reply.notFound("Developer not found");
      }

      // Generate new token
      const newToken = randomUUID();

      const developer = await prisma.developer.update({
        where: { id },
        data: {
          token: newToken,
        },
      });

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_developers_schemas.refreshDeveloperKey.response
        >
      >({
        statusCode: 200,
        message: "Developer key refreshed successfully",
        data: developer,
      });
    } catch (error) {
      fastify.log.error("Error refreshing developer key: %s", error);

      // Handle Prisma not found errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2025"
      ) {
        return reply.notFound("Developer not found");
      }

      return reply.internalServerError(
        "Failed to refresh developer key. Please check server logs for more details."
      );
    }
  });

  // ==================== DELETE /developers/:id ====================

  fastify.delete("/:id", async (request, reply) => {
    const validationResult = validateRequest(
      request.params,
      reply,
      v1_admin_schemas.v1_admin_developers_schemas.deleteDeveloper.params,
      "params"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { id } = validationResult;

      // Check if developer exists
      const existingDeveloper = await prisma.developer.findUnique({
        where: { id },
      });

      if (!existingDeveloper) {
        return reply.notFound("Developer not found");
      }

      // Delete developer (runs have optional developerId, so this should work)
      await prisma.developer.delete({
        where: { id },
      });

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_developers_schemas.deleteDeveloper.response
        >
      >({
        statusCode: 200,
        message: "Developer deleted successfully",
        data: {
          id,
          deleted: true,
        },
      });
    } catch (error) {
      fastify.log.error("Error deleting developer: %s", error);

      // Handle Prisma not found errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2025"
      ) {
        return reply.notFound("Developer not found");
      }

      // Handle foreign key constraint errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2003"
      ) {
        return reply.conflict(
          "Cannot delete developer. There are associated records that reference this developer."
        );
      }

      return reply.internalServerError(
        "Failed to delete developer. Please check server logs for more details."
      );
    }
  });
};

export default developersRoutes;
