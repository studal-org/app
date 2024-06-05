import { env } from "@/env";
import { type components } from "@/server/lib/agents/college/defs";
import { DateTime } from "luxon";

export const normalizePeriodSchedule = (props: {
  scheduleDate: string;
  periodSchedule: components["schemas"]["PeriodsSchedule"]["schedule"][number];
}) => {
  const {
    periodSchedule: { startTime, endTime },
  } = props;
  if (!startTime || !endTime) return null;

  const scheduleDate = DateTime.fromISO(props.scheduleDate, {
    setZone: true,
  }).setZone(env.APP_TZ, { keepLocalTime: true });

  const { year, month, day } = scheduleDate;

  const normalizeDate = (v: string) =>
    DateTime.fromISO(v, { setZone: true })
      .set({ year, month, day })
      .setZone(env.APP_TZ, { keepLocalTime: true });

  return {
    ...props.periodSchedule,
    startTime: normalizeDate(startTime),
    endTime: normalizeDate(endTime),
  };
};
