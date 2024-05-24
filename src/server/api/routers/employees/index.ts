import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const employeesRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const employee = await collegeAgent.GET("/Employee/{id}", {
        params: { path: { id: input.id } },
      });
      if (employee.error) {
        if (
          employee.error.code === "ReferenceNotFound" &&
          employee.error.referenceType === "employee"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: employee.error,
        });
      }
      return employee.data;
    }),
});
