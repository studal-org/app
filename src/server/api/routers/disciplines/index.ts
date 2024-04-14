import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const disciplinesRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const discipline = await collegeAgent.GET("/Discipline/{id}", {
        params: { path: { id: input.id } },
      });
      if (discipline.error) {
        if (
          discipline.error.code === "ReferenceNotFound" &&
          discipline.error.referenceType === "discipline"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discipline with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: discipline.error,
        });
      }
      return discipline.data;
    }),
});
