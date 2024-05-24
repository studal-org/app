import { api } from "@/trpc/react";
import { useScheduleParams } from "./schedule-params";

export const useScheduleForDate = () => {
  const [{ groupId, scheduleDate }] = useScheduleParams();

  if (!groupId) return undefined;

  const [scheduleForDate] =
    api.scheduleForDate.findByScheduleDateForGroupId.useSuspenseQuery({
      groupId,
      scheduleDate,
    });

  return scheduleForDate;
};
