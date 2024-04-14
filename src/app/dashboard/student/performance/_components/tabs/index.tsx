"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Suspense } from "react";
import PeriodPicker from "../period-picker";
import PerformanceByDate from "./date";

const PerformanceTabs = () => {
  const [by, setBy] = useQueryState(
    "by",
    parseAsStringEnum(["date", "discipline"] as const)
      .withOptions({ history: "replace" })
      .withDefault("date"),
  );
  return (
    <Tabs value={by} onValueChange={(v) => setBy(v as "date" | "discipline")}>
      <div className="flex gap-y-1 gap-x-2 flex-col sm:flex-row">
        <TabsList className="grid w-full sm:w-fit grid-cols-2">
          <TabsTrigger value="date">По дате</TabsTrigger>
          <TabsTrigger value="discipline">По дисциплине</TabsTrigger>
        </TabsList>
        <PeriodPicker className="sm:w-[300px]" />
      </div>
      <TabsContent value="date" className="mt-8">
        <Suspense fallback="Loading...">
          <PerformanceByDate />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default PerformanceTabs;
