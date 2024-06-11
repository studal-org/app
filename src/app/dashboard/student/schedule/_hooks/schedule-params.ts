import { createZodParser } from "@/lib/utils";
import { api } from "@/trpc/react";
import { DateTime } from "luxon";
import { createParser, useQueryStates } from "nuqs";
import { z } from "zod";

const fmt = "yyyy-MM-dd";

export const useScheduleParams = () => {
  const [student] = api.user.student.read.useSuspenseQuery();
  const today = DateTime.now().startOf("day");

  return useQueryStates(
    {
      scheduleDate: createParser({
        parse: (value) => {
          const dateTime = DateTime.fromFormat(value, fmt);
          return dateTime.isValid ? dateTime : null;
        },
        serialize: (value) => value.toFormat(fmt),
      }).withDefault(today),
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
