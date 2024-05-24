"use client";

import { TabsContent } from "@/components/ui/tabs";
import { type components } from "@/server/lib/agents/college/defs";
import { Suspense, type FC } from "react";
import PerformanceByDate from "./date";
import PerformanceByDiscipline from "./discipline";

const PerformanceTabsContents: FC<{
  performance: components["schemas"]["StudentPerformance"][];
}> = ({ performance }) => {
  return (
    <>
      <TabsContent value="date" className="mt-8">
        <Suspense fallback="Loading...">
          <PerformanceByDate performance={performance} />
        </Suspense>
      </TabsContent>
      <TabsContent value="discipline" className="mt-8">
        <Suspense fallback="Loading...">
          <PerformanceByDiscipline performance={performance} />
        </Suspense>
      </TabsContent>
    </>
  );
};

export default PerformanceTabsContents;
