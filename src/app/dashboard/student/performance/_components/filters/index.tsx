import { type components } from "@/server/lib/agents/college/defs";
import { atom } from "jotai";
import { type FC } from "react";
import ControlTypesFilter from "./control-types";
import DisciplinesFilter from "./disciplines";
import HasMarksFilter from "./has-marks";
import LatesFilter from "./lates";
import NoShowsFilter from "./no-shows";
import WorkTypesFilter from "./work-types";

export const performanceFiltersAtom = atom(
  new Map<
    string,
    {
      predicate: (
        document: components["schemas"]["StudentPerformance"],
      ) => unknown;
    }
  >(),
);

const PerformanceFilters: FC = () => {
  return (
    <>
      <DisciplinesFilter />
      <ControlTypesFilter />
      <WorkTypesFilter />
      <LatesFilter />
      <NoShowsFilter />
      <HasMarksFilter />
    </>
  );
};

export default PerformanceFilters;
