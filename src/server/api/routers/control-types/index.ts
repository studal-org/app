import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const controlTypesRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const controlType = await collegeAgent.GET("/ControlType/{id}", {
        params: { path: { id: input.id } },
      });
      if (controlType.error) {
        if (
          controlType.error.code === "ReferenceNotFound" &&
          controlType.error.referenceType === "controlType"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ControlType with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: controlType.error,
        });
      }
      return controlType.data;
    }),
});
