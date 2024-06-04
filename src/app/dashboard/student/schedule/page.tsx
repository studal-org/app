"use client";

import { type FC } from "react";
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
        <ScheduleView className="mt-8" />
      </div>
    </div>
  );
};

export default SchedulePage;