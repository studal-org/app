import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { api } from "@/trpc/react";
import { isTRPCClientError } from "@/trpc/shared";
import { Fragment, Suspense, type FC, type HTMLProps } from "react";
import {
  ErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import { useScheduleParams } from "../_hooks/schedule-params";
import PeriodsBreak from "./break";
import Period from "./period";

const ScheduleView: FC = () => {
  const [scheduleParams] = useScheduleParams();

  return (
    <ErrorBoundary
      FallbackComponent={ScheduleViewContentError}
      resetKeys={[scheduleParams]}
    >
      <Suspense>
        <ScheduleViewContent />
      </Suspense>
    </ErrorBoundary>
  );
};

const ScheduleViewContent: FC<HTMLProps<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [{ groupId, scheduleDate }] = useScheduleParams();

  if (!groupId) return undefined;

  const [scheduleForDate] =
    api.scheduleForDate.findByScheduleDateForGroupId.useSuspenseQuery(
      {
        groupId,
        scheduleDate,
      },
      {
        retry: (failureCount, { data }) =>
          data?.code !== "NOT_FOUND" && failureCount <= 3,
      },
    );

  if (!scheduleForDate) return null;

  const [periodsSchedule] = api.periodSchedules.read.useSuspenseQuery({
    id: scheduleForDate.periodScheduleId,
  });

  const periodsByPeriodNumber = scheduleForDate.schedule
    .map(({ periodNumber, ...rest }) =>
      periodNumber === null
        ? { periodNumber: -1, ...rest }
        : { periodNumber, ...rest },
    )
    .toSorted(({ periodNumber: a }, { periodNumber: b }) => a - b)
    .reduce((acc, p) => {
      const periodNumber = p.periodNumber;
      const forPeriodNumber = acc.get(periodNumber);
      const periodSchedule = periodsSchedule.schedule.find(
        (s) => s.periodNumber === periodNumber,
      );
      if (!forPeriodNumber)
        acc.set(periodNumber, { periodSchedule, classes: [p] });
      else forPeriodNumber.classes.push(p);
      return acc;
    }, new Map<number, { periodSchedule: components["schemas"]["PeriodsSchedule"]["schedule"][number] | undefined; classes: components["schemas"]["Period_AsItem"][] }>());

  return (
    <div {...props} className={cn("flex flex-col gap-4", className)}>
      {[...periodsByPeriodNumber].map(
        ([periodNumber, { periodSchedule, classes }], i, array) => (
          <Fragment key={periodNumber}>
            <Period
              scheduleDate={scheduleForDate.scheduleDate}
              periodNumber={periodNumber}
              periodSchedule={periodSchedule}
              classes={classes}
            />
            {i !== periodsByPeriodNumber.size - 1 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="text-muted-foreground">
                    Перерыв{" "}
                    <PeriodsBreak
                      scheduleDate={scheduleForDate.scheduleDate}
                      prev={periodSchedule}
                      next={array[i + 1]![1].periodSchedule}
                    />
                  </span>
                </div>
              </div>
            )}
          </Fragment>
        ),
      )}
    </div>
  );
};

const ScheduleViewContentError: FC<FallbackProps> = ({ error }) => {
  const { showBoundary } = useErrorBoundary();

  if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND")
    return "Not Found";

  showBoundary(error);
};

export default ScheduleView;