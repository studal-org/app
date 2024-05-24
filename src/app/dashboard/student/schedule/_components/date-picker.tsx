"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { add, format, getDefaultOptions } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type FC } from "react";
import { useScheduleParams } from "../_hooks/schedule-params";

const DatePicker: FC = () => {
  const [{ groupId, scheduleDate }, setScheduleParams] = useScheduleParams();
  const { locale } = getDefaultOptions();
  const toDate = add(new Date(), { weeks: 1 });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {scheduleDate ? (
            format(scheduleDate, "dd MMM yyyy, iiiiii")
          ) : (
            <span>Выберите дату</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={locale}
          fromDate={new Date(2000, 0, 1)}
          toDate={toDate}
          captionLayout="dropdown-buttons"
          mode="single"
          defaultMonth={scheduleDate}
          selected={scheduleDate}
          onSelect={(v) => setScheduleParams({ groupId, scheduleDate: v })}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
