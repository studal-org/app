import { createTRPCRouter } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { studentProcedure } from "../procedure";

export const performanceRouter = createTRPCRouter({
  read: studentProcedure
    .input(z.object({ periodStart: z.date(), periodEnd: z.date() }))
    .query(async ({ input, ctx }) => {
      const marks = await collegeAgent.GET("/Student/{id}/Performance", {
        params: {
          path: { id: ctx.session.student.id },
          query: {
            periodStart: input.periodStart.toISOString(),
            periodEnd: input.periodEnd.toISOString(),
          },
        },
      });
      if (marks.error) {
        if (
          marks.error.code === "ReferenceNotFound" &&
          marks.error.referenceType === "student"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "This User is not associated with a Student.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: marks.error,
        });
      }
      return marks.data;
    }),
});
