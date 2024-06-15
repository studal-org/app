import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { type RouterOutputs } from "@/trpc/shared";
import { Fragment, type FC } from "react";
import PeriodClass, { PeriodClassEmpty } from "./class";
import PeriodTimespan from "./timespan";

const Period: FC<{
  periodNumber: number;
  periodSchedule:
    | RouterOutputs["periodSchedules"]["read"]["schedule"][number]
    | undefined;
  classes: components["schemas"]["Period_AsItem"][];
}> = ({ periodNumber, periodSchedule, classes }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-base font-medium uppercase text-foreground/75">
        <div>{periodNumber} урок</div>
        <div>
          <PeriodTimespan periodSchedule={periodSchedule} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {classes
          .map(({ subgroup, ...rest }) =>
            subgroup === null
              ? { subgroup: 0, ...rest }
              : { subgroup, ...rest },
          )
          .toSorted(({ subgroup: a }, { subgroup: b }) => a - b)
          .map((periodClass, i, array) => (
            <Fragment key={periodClass.number}>
              {(() => {
                const prev = array[i - 1];
                const diff = periodClass.subgroup - (prev?.subgroup ?? 0);
                if (diff <= 1) return;
                return (
                  <>
                    {[...Array(diff - 1).keys()].map((key) => (
                      <PeriodClassEmpty
                        key={key}
                        className="min-w-60 flex-grow basis-0"
                      />
                    ))}
                  </>
                );
              })()}
              <PeriodClass
                periodClass={periodClass}
                className={cn(
                  "min-w-60 flex-grow basis-0",
                  periodClass.subgroup <= 0 && "basis-full",
                  periodClass.subgroup <= 0 && array[i + 1] && "mb-4",
                )}
              />
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Period;
