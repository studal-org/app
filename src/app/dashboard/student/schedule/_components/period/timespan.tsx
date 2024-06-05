import { type RouterOutputs } from "@/trpc/shared";
import { DateTime } from "luxon";
import { type FC } from "react";

const PeriodTimespan: FC<{
  periodSchedule:
    | RouterOutputs["periodSchedules"]["read"]["schedule"][number]
    | undefined;
}> = ({ periodSchedule }) => {
  if (!periodSchedule?.startTime || !periodSchedule.endTime) return;

  const { startTime, endTime } = periodSchedule;

  return (
    <>
      {DateTime.fromJSDate(startTime).toLocal().toFormat("HH:mm")} -{" "}
      {DateTime.fromJSDate(endTime).toLocal().toFormat("HH:mm")}
    </>
  );
};

export default PeriodTimespan;
