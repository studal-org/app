import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const workTypesRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const workType = await collegeAgent.GET("/WorkType/{id}", {
        params: { path: { id: input.id } },
      });
      if (workType.error) {
        if (
          workType.error.code === "ReferenceNotFound" &&
          workType.error.referenceType === "workType"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "WorkType with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: workType.error,
        });
      }
      return workType.data;
    }),
});
