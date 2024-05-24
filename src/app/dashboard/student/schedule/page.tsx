"use client";

import { Suspense, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import DatePicker from "./_components/date-picker";
import ScheduleView from "./_components/view";

const SchedulePage: FC = () => {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Расписание
      </h1>
      <div className="mt-4">
        <DatePicker />
        <ErrorBoundary fallback={<span>error</span>}>
          <Suspense fallback="loading">
            <ScheduleView className="mt-8" />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default SchedulePage;
