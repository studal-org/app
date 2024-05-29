import { TabsContent } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { Suspense, type FC } from "react";
import { usePeriod } from "../../../_hooks/period";
import { performanceFiltersAtom } from "../../filters";
import PerformanceByDate from "./date";
import PerformanceByDiscipline from "./discipline";
import { PerformanceElementGroupLoading } from "./performance-element/group";

const PerformanceTabsContents: FC = () => {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <Suspense fallback={<PerformanceTabsContentsContentLoading />}>
        <PerformanceTabsContentsContent />
      </Suspense>
    </div>
  );
};

const PerformanceTabsContentsContent: FC = () => {
  const [period] = usePeriod();
  const [performance] = api.user.student.performance.read.useSuspenseQuery({
    ...period,
  });

  const [filters] = useAtom(performanceFiltersAtom);

  const filtered = performance
    .filter((item) =>
      [...filters].every(([_, { predicate }]) => predicate(item)),
    )
    .toSorted(
      ({ date: a }, { date: b }) =>
        new Date(b).getTime() - new Date(a).getTime(),
    );
  return (
    <>
      <TabsContent value="date" asChild>
        <PerformanceByDate performance={filtered} />
      </TabsContent>
      <TabsContent value="discipline" asChild>
        <PerformanceByDiscipline performance={filtered} />
      </TabsContent>
    </>
  );
};

const PerformanceTabsContentsContentLoading: FC = () => (
  <>
    {[...Array(5).keys()].map((key) => (
      <PerformanceElementGroupLoading key={key} />
    ))}
  </>
);

export default PerformanceTabsContents;
