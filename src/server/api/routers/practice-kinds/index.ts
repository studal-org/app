import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const practiceKindsRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const practiceKind = await collegeAgent.GET("/PracticeKind/{id}", {
        params: { path: { id: input.id } },
      });
      if (practiceKind.error) {
        if (
          practiceKind.error.code === "ReferenceNotFound" &&
          practiceKind.error.referenceType === "practiceKind"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "PracticeKind with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: practiceKind.error,
        });
      }
      return practiceKind.data;
    }),
});
