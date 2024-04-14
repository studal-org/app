import { protectedProcedure } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";

export const studentProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const student = await collegeAgent.GET("/Individual/{id}/Student", {
      params: { path: { id: ctx.session.user.id } },
    });
    if (student.error) {
      if (student.error.code === "ReferenceNotFound")
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This User is not associated with an Individual.",
        });

      if (student.error.code === "NotFound")
        throw new TRPCError({
          message: "This User is not Student.",
          code: "NOT_FOUND",
        });
      throw new TRPCError({
        message: "Something went wrong.",
        code: "INTERNAL_SERVER_ERROR",
        cause: student.error,
      });
    }
    return next({
      ctx: { ...ctx, session: { ...ctx.session, student: student.data } },
    });
  },
);
