import { type FC } from "react";
import PerformanceTabs from "./_components/tabs";

const PerformancePage: FC = () => {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Успеваемость
      </h1>
      <div className="mt-4">
        <PerformanceTabs />
      </div>
    </div>
  );
};

export default PerformancePage;
