"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, type ComponentProps, type FC } from "react";
import { usePeriod } from "../../_hooks/period";
import PerformanceFilter from "../filter";
import { usePerformanceFilters } from "../filter/provider";
import PeriodPicker from "../period-picker";
import PerformanceTabsContents from "./contents";

const PerformanceTabs: FC<ComponentProps<typeof Tabs>> = (props) => {
  const [period] = usePeriod();

  useEffect(() => console.log(period), [period]);

  const [performance] = api.user.student.performance.read.useSuspenseQuery({
    ...period,
  });

  const [by, setBy] = useQueryState(
    "by",
    parseAsStringEnum(["date", "discipline"] as const)
      .withOptions({ history: "replace" })
      .withDefault("date"),
  );

  const [filters] = usePerformanceFilters();

  const filtered = performance.filter((item) =>
    [...filters].every(([_, { predicate }]) => predicate(item)),
  );

  return (
    <Tabs
      value={by}
      onValueChange={(v) => setBy(v as "date" | "discipline")}
      {...props}
    >
      <div className="flex gap-y-1 gap-x-2 flex-col sm:flex-row">
        <TabsList className="grid w-full sm:w-fit grid-cols-2">
          <TabsTrigger value="date">По дате</TabsTrigger>
          <TabsTrigger value="discipline">По дисциплине</TabsTrigger>
        </TabsList>
        <PeriodPicker className="sm:w-[300px]" />
        <PerformanceFilter />
      </div>
      <PerformanceTabsContents performance={filtered} />
    </Tabs>
  );
};

export default PerformanceTabs;
