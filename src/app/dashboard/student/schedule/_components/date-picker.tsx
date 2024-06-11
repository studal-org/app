"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { add, getDefaultOptions } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import { type FC, type HTMLAttributes } from "react";
import { useScheduleParams } from "../_hooks/schedule-params";

const DatePicker: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [{ groupId, scheduleDate }, setScheduleParams] = useScheduleParams();
  const { locale } = getDefaultOptions();
  const toDate = add(new Date(), { weeks: 1 });

  return (
    <div className={cn("w-full", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {scheduleDate ? (
              scheduleDate.toFormat("dd MMM yyyy, ccc")
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
            defaultMonth={scheduleDate.toJSDate()}
            selected={scheduleDate.toJSDate()}
            onSelect={(v) => {
              if (!v) return;
              const scheduleDate = DateTime.fromJSDate(v);
              if (!scheduleDate.isValid) return;
              return setScheduleParams({ groupId, scheduleDate });
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
