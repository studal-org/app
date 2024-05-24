import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const periodSchedulesRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid().nullish() }))
    .query(async ({ input }) => {
      if (!input.id) {
        return readDefault();
      }
      const periodsSchedule = await collegeAgent.GET("/PeriodsSchedule/{id}", {
        params: { path: { id: input.id } },
      });
      if (periodsSchedule.error) {
        if (
          periodsSchedule.error.code === "ReferenceNotFound" &&
          periodsSchedule.error.referenceType === "periods_schedule"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "PeriodSchedule with provided ID was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: periodsSchedule.error,
        });
      }
      return periodsSchedule.data;
    }),
});

const readDefault = async () => {
  const periodsSchedule = await collegeAgent.GET("/PeriodsSchedule/Default");
  if (periodsSchedule.error)
    throw new TRPCError({
      message: "Something went wrong.",
      code: "INTERNAL_SERVER_ERROR",
    });
  return periodsSchedule.data;
};
