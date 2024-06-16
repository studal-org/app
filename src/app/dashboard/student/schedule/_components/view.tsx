import NotFound from "@/components/not-found";
import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { api } from "@/trpc/react";
import { isTRPCClientError, type RouterOutputs } from "@/trpc/shared";
import { type DateTime } from "luxon";
import {
  Fragment,
  Suspense,
  useMemo,
  type FC,
  type HTMLAttributes,
  type HTMLProps,
} from "react";
import {
  ErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import { useScheduleParams } from "../_hooks/schedule-params";
import PeriodsBreak from "./break";
import Period from "./period";

const ScheduleView: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const [{ groupId, scheduleDate }] = useScheduleParams();

  if (!groupId) return;

  return (
    <div {...props}>
      <ErrorBoundary
        FallbackComponent={ScheduleViewContentError}
        resetKeys={[groupId, scheduleDate]}
      >
        <Suspense>
          <ScheduleViewContent
            scheduleViewContent={{ scheduleParams: { groupId, scheduleDate } }}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const ScheduleViewContent: FC<
  HTMLProps<HTMLDivElement> & {
    scheduleViewContent: {
      scheduleParams: { groupId: string; scheduleDate: DateTime };
    };
  }
> = ({
  scheduleViewContent: {
    scheduleParams: { groupId, scheduleDate },
  },
  className,
  ...props
}) => {
  const [scheduleForDate] =
    api.scheduleForDate.findByScheduleDateForGroupId.useSuspenseQuery(
      {
        groupId,
        scheduleDate: scheduleDate.toJSDate(),
      },
      {
        retry: (failureCount, { data }) =>
          data?.code !== "NOT_FOUND" && failureCount <= 3,
      },
    );

  const [periodsSchedule] = api.periodSchedules.read.useSuspenseQuery({
    id: scheduleForDate.periodScheduleId,
    forDate: scheduleForDate.scheduleDate,
  });

  const periodsByPeriodNumber = useMemo(
    () =>
      scheduleForDate.schedule
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
        }, new Map<number, { periodSchedule: RouterOutputs["periodSchedules"]["read"]["schedule"][number] | undefined; classes: components["schemas"]["Period_AsItem"][] }>()),
    [scheduleForDate, periodsSchedule.schedule],
  );

  const periods = useMemo(
    () => [...periodsByPeriodNumber],
    [periodsByPeriodNumber],
  );

  if (!periods.length) return <NotFound />;

  return (
    <div {...props} className={cn("flex flex-col gap-4", className)}>
      {periods.map(([periodNumber, { periodSchedule, classes }], i, array) => (
        <Fragment key={periodNumber}>
          <Period
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
                    prev={periodSchedule}
                    next={array[i + 1]![1].periodSchedule}
                  />
                </span>
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

const ScheduleViewContentError: FC<FallbackProps> = ({ error }) => {
  const { showBoundary } = useErrorBoundary();

  if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND")
    return <NotFound />;

  showBoundary(error);
};

export default ScheduleView;
