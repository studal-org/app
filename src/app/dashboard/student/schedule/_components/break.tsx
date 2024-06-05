import { type RouterOutputs } from "@/trpc/shared";
import { DateTime } from "luxon";
import { type FC } from "react";

type PeriodSchedule =
  RouterOutputs["periodSchedules"]["read"]["schedule"][number];

const PeriodsBreak: FC<{
  prev: PeriodSchedule | undefined;
  next: PeriodSchedule | undefined;
}> = ({ prev, next }) => {
  if (!prev?.endTime || !next?.startTime) return;

  const { hours, minutes } = DateTime.fromJSDate(next.startTime).diff(
    DateTime.fromJSDate(prev.endTime),
    ["hours", "minutes"],
  );

  const parts = [hours > 0 && `${hours} ч.`, minutes > 0 && `${minutes} мин.`];

  return parts.filter(Boolean).join(" ");
};

export default PeriodsBreak;
