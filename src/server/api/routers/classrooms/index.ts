import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const classroomsRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const classroom = await collegeAgent.GET("/Classroom/{id}", {
        params: { path: { id: input.id } },
      });
      if (classroom.error) {
        if (
          classroom.error.code === "ReferenceNotFound" &&
          classroom.error.referenceType === "classroom"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Classroom with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: classroom.error,
        });
      }
      return classroom.data;
    }),
});
