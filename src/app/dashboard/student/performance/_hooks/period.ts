import { endOfDay, subDays } from "date-fns";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo } from "react";

export const usePeriod = () => {
  const now = useMemo(() => endOfDay(new Date()), []);
  // return useQueryState(
  //   "period",
  //   parseAsJson((value) =>
  //     z.object({ from: z.date(), to: z.date() }).parse(value),
  //   )
  //     .withOptions({ history: "replace" })
  //     .withDefault({ from: subDays(now, 7), to: now }),
  // );
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
