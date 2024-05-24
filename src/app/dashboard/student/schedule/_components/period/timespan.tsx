import { type components } from "@/server/lib/agents/college/defs";
import { type FC } from "react";
import { normalizePeriodSchedule } from "../../_utils/normalize-period-schedule";

const PeriodTimespan: FC<{
  scheduleDate: string;
  periodSchedule:
    | components["schemas"]["PeriodsSchedule"]["schedule"][number]
    | undefined;
}> = ({ scheduleDate, periodSchedule }) => {
  if (!periodSchedule) return;

  const normalizedPeriodSchedule = normalizePeriodSchedule({
    scheduleDate,
    periodSchedule,
  });

  if (!normalizedPeriodSchedule) return;

  const { startTime, endTime } = normalizedPeriodSchedule;

  return (
    <>
      {startTime.toLocal().toFormat("HH:mm")} -{" "}
      {endTime.toLocal().toFormat("HH:mm")}
    </>
  );
};

export default PeriodTimespan;
