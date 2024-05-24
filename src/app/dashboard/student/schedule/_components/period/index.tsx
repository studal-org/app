import { type components } from "@/server/lib/agents/college/defs";
import { type FC } from "react";
import PeriodClass from "./class";
import PeriodTimespan from "./timespan";

const Period: FC<{
  periodNumber: number;
  scheduleDate: string;
  periodSchedule:
    | components["schemas"]["PeriodsSchedule"]["schedule"][number]
    | undefined;
  classes: components["schemas"]["Period_AsItem"][];
}> = ({ periodNumber, scheduleDate, periodSchedule, classes }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-base font-medium uppercase text-foreground/75 flex justify-between">
        <div>{periodNumber} урок</div>
        <div>
          <PeriodTimespan
            scheduleDate={scheduleDate}
            periodSchedule={periodSchedule}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {classes
          .map(({ subgroup, ...rest }) =>
            subgroup === null
              ? { subgroup: -1, ...rest }
              : { subgroup, ...rest },
          )
          .toSorted(({ subgroup: a }, { subgroup: b }) => a - b)
          .map((periodClass) => (
            <PeriodClass
              key={periodClass.number}
              periodClass={periodClass}
              className="flex-grow basis-0 min-w-60"
            />
          ))}
      </div>
    </div>
  );
};

export default Period;
