import { env } from "@/env";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const periodSchedulesRouter = createTRPCRouter({
  read: protectedProcedure
    .input(z.object({ id: z.string().uuid().nullish(), forDate: z.string() }))
    .query(async ({ input: { id, forDate } }) => {
      const periodsSchedule = await (id ? readById(id) : readDefault());

      const scheduleDate = DateTime.fromISO(forDate, {
        setZone: true,
      }).setZone(env.APP_TZ, { keepLocalTime: true });

      const { year, month, day } = scheduleDate;

      const normalizeDate = (v: string) =>
        DateTime.fromISO(v, { setZone: true })
          .set({ year, month, day })
          .setZone(env.APP_TZ, { keepLocalTime: true })
          .toJSDate();

      const schedule = periodsSchedule.schedule.map(
        ({ periodNumber, startTime, endTime }) => ({
          periodNumber,
          startTime: startTime ? normalizeDate(startTime) : null,
          endTime: endTime ? normalizeDate(endTime) : null,
        }),
      );
      return { ...periodsSchedule, schedule };
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

const readById = async (id: string) => {
  const periodsSchedule = await collegeAgent.GET("/PeriodsSchedule/{id}", {
    params: { path: { id } },
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
};
