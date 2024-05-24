import { endOfDay, subDays } from "date-fns";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo } from "react";

export const usePeriod = () => {
  const now = useMemo(() => endOfDay(new Date()), []);
  return useQueryStates(
    {
      periodStart: parseAsIsoDateTime.withDefault(subDays(now, 7)),
      periodEnd: parseAsIsoDateTime.withDefault(now),
    },
    {
      history: "replace",
    },
  );
};
