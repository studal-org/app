import { createZodParser } from "@/lib/utils";
import { api } from "@/trpc/react";
import { endOfDay } from "date-fns";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { z } from "zod";

export const useScheduleParams = () => {
  const now = useMemo(() => endOfDay(new Date()), []);
  const [student] = api.user.student.read.useSuspenseQuery();
  return useQueryStates(
    {
      scheduleDate: parseAsIsoDateTime.withDefault(now),
      groupId: createZodParser(
        z
          .string()
          .transform((v) => (v === "false" ? false : v))
          .pipe(z.string().uuid().or(z.literal(false))),
        String,
      ).withDefault(student.groupId ?? "false"),
    },
    {
      history: "replace",
    },
  );
};
