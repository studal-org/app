import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const individualsRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const individual = await collegeAgent.GET("/Individual/{id}", {
        params: { path: { id: input.id } },
      });
      if (individual.error) {
        if (
          individual.error.code === "ReferenceNotFound" &&
          individual.error.referenceType === "individual"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Individual with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: individual.error,
        });
      }
      return individual.data;
    }),
});
