import { type FC } from "react";
import PerformanceFiltersProvider from "./_components/filter/provider";
import PerformanceTabs from "./_components/tabs";

const PerformancePage: FC = () => {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Успеваемость
      </h1>
      <PerformanceFiltersProvider>
        <PerformanceTabs className="mt-4" />
      </PerformanceFiltersProvider>
    </div>
  );
};

export default PerformancePage;
