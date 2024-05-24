import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const scheduleForDateRouter = createTRPCRouter({
  findByScheduleDateForGroupId: protectedProcedure
    .input(z.object({ scheduleDate: z.date(), groupId: z.string().uuid() }))
    .query(async ({ input }) => {
      const scheduleForDateForGroup = await collegeAgent.GET(
        "/ScheduleForDate/FindByScheduleDate",
        {
          params: {
            query: {
              scheduleDate: input.scheduleDate.toISOString(),
              groupId: input.groupId,
            },
          },
        },
      );
      if (scheduleForDateForGroup.error) {
        if (
          scheduleForDateForGroup.error.code === "ReferenceNotFound" &&
          scheduleForDateForGroup.error.referenceType === "group"
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group with provided ID was not found.",
          });
        if (scheduleForDateForGroup.error.code === "NotFound")
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Schedule for date with provided scheduleDate was not found.",
          });
        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
          cause: scheduleForDateForGroup.error,
        });
      }
      return scheduleForDateForGroup.data;
    }),
});
