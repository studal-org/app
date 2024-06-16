import NotFound from "@/components/not-found";
import { Skeleton } from "@/components/ui/skeleton";
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
        <div {...props} className="flex flex-col gap-4">
          <Suspense fallback={<ScheduleViewContentLoading />}>
            <ScheduleViewContent
              scheduleViewContent={{
                scheduleParams: { groupId, scheduleDate },
              }}
            />
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
};

const ScheduleViewContent: FC<{
  scheduleViewContent: {
    scheduleParams: { groupId: string; scheduleDate: DateTime };
  };
}> = ({
  scheduleViewContent: {
    scheduleParams: { groupId, scheduleDate },
  },
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
    <>
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
    </>
  );
};

const ScheduleViewContentLoading: FC = () => (
  <>
    {[...Array(3).keys()].map((key, _, array) => (
      <Fragment key={key}>
        <div
          className={cn(
            "flex h-full flex-col rounded-lg border bg-card/40 text-card-foreground shadow-sm",
          )}
        >
          <div className="p-6 pb-2">
            <Skeleton className="inline-block whitespace-pre text-lg font-medium leading-none tracking-tight text-foreground/85">
              {" ".repeat(40)}
            </Skeleton>
          </div>
          <div className="p-6 pt-0"></div>
        </div>
        {key !== array.length - 1 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground">
                Перерыв{" "}
                <Skeleton className="inline-block whitespace-pre">
                  {" ".repeat(15)}
                </Skeleton>
              </span>
            </div>
          </div>
        )}
      </Fragment>
    ))}
  </>
);

const ScheduleViewContentError: FC<FallbackProps> = ({ error }) => {
  const { showBoundary } = useErrorBoundary();

  if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND")
    return <NotFound />;

  showBoundary(error);
};

export default ScheduleView;
