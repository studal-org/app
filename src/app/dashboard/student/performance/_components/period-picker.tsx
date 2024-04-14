"use client";

import { format, getDefaultOptions } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePeriod } from "../_hooks/period";

const PeriodPicker: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  const { locale } = getDefaultOptions();
  const toDate = new Date();

  const [{ periodStart: periodFrom, periodEnd: periodTo }, setShownPeriod] =
    usePeriod();

  const [pickedPeriod, setPickedPeriod] = React.useState<DateRange | undefined>(
    { from: periodFrom, to: periodTo },
  );

  const setPeriod = async (date: DateRange | undefined) => {
    setPickedPeriod(date);
    if (date?.from && date.to) {
      await setShownPeriod({ periodStart: date.from, periodEnd: date.to });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !pickedPeriod && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {pickedPeriod?.from ? (
              pickedPeriod.to ? (
                <>
                  {format(pickedPeriod.from, "dd MMM yyyy")} -{" "}
                  {format(pickedPeriod.to, "dd MMM yyyy")}
                </>
              ) : (
                format(pickedPeriod.from, "dd MMM yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={locale}
            fromDate={new Date(2000, 0, 1)}
            toDate={toDate}
            captionLayout="dropdown-buttons"
            initialFocus
            mode="range"
            defaultMonth={pickedPeriod?.from}
            selected={pickedPeriod}
            onSelect={setPeriod}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PeriodPicker;
