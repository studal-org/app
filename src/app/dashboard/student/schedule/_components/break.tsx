import { type components } from "@/server/lib/agents/college/defs";
import { type FC } from "react";
import { normalizePeriodSchedule } from "../_utils/normalize-period-schedule";

type PeriodSchedule =
  components["schemas"]["PeriodsSchedule"]["schedule"][number];

const PeriodsBreak: FC<{
  scheduleDate: string;
  prev: PeriodSchedule | undefined;
  next: PeriodSchedule | undefined;
}> = ({ scheduleDate, prev, next }) => {
  if (!prev || !next) return;

  const prevNormalized = normalizePeriodSchedule({
    scheduleDate,
    periodSchedule: prev,
  });
  const nextNormalized = normalizePeriodSchedule({
    scheduleDate,
    periodSchedule: next,
  });

  if (!prevNormalized || !nextNormalized) return;

  const { hours, minutes } = nextNormalized.startTime.diff(
    prevNormalized.endTime,
    ["hours", "minutes"],
  );

  const parts = [hours > 0 && `${hours} ч.`, minutes > 0 && `${minutes} мин.`];

  return parts.filter(Boolean).join(" ");
};

export default PeriodsBreak;
