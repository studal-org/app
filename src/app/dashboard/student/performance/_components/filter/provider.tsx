"use client";
import { type components } from "@/server/lib/agents/college/defs";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from "react";

type PerformanceFilter = Map<
  string,
  {
    predicate: (
      document: components["schemas"]["StudentPerformance"],
    ) => unknown;
  }
>;

const PerformanceFiltersContext = createContext<
  [PerformanceFilter, Dispatch<SetStateAction<PerformanceFilter>>]
>([
  new Map() as PerformanceFilter,
  () => {
    return;
  },
]);

const PerformanceFiltersProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<PerformanceFilter>(new Map());
  return (
    <PerformanceFiltersContext.Provider value={[filters, setFilters]}>
      {children}
    </PerformanceFiltersContext.Provider>
  );
};

export const usePerformanceFilters = () =>
  useContext(PerformanceFiltersContext);

export default PerformanceFiltersProvider;
