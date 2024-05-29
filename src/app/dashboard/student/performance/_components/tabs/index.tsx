"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { type ComponentProps, type FC } from "react";
import PerformanceTabsContents from "./contents";
import PerformanceTabsFilters from "./filters";
import PeriodPicker from "./period-picker";

const PerformanceTabs: FC<ComponentProps<typeof Tabs>> = (props) => {
  const [by, setBy] = useQueryState(
    "by",
    parseAsStringEnum(["date", "discipline"] as const)
      .withOptions({ history: "replace" })
      .withDefault("date"),
  );

  return (
    <Tabs
      value={by}
      onValueChange={(v) => setBy(v as "date" | "discipline")}
      {...props}
    >
      <div className="flex gap-y-1 gap-x-2 justify-between flex-col sm:flex-row">
        <div className="flex gap-y-1 gap-x-2 flex-col sm:flex-row">
          <TabsList className="grid w-full sm:w-fit grid-cols-2">
            <TabsTrigger value="date">По дате</TabsTrigger>
            <TabsTrigger value="discipline">По дисциплине</TabsTrigger>
          </TabsList>
          <PeriodPicker className="sm:w-[300px]" />
        </div>
        <PerformanceTabsFilters />
      </div>
      <PerformanceTabsContents />
    </Tabs>
  );
};

export default PerformanceTabs;
