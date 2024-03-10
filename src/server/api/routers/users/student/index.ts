import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";

export const studentRouter = createTRPCRouter({
  read: protectedProcedure.query(async ({ ctx }) => {
    const student = await collegeAgent.GET("/Individual/{id}/Student", {
      params: { path: { id: ctx.session.user.id } },
    });
    if (!student.data) {
      if (student.response.status === 404) {
        throw new TRPCError({
          message: "This User is not Student.",
          code: "NOT_FOUND",
        });
      }
      throw new TRPCError({
        message: "Something went wrong.",
        code: "INTERNAL_SERVER_ERROR",
        cause: student.error,
      });
    }
    return student.data;
  }),
});
