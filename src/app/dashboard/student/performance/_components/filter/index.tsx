import { cn } from "@/lib/utils";
import { type FC, type HTMLAttributes } from "react";
import ControlTypesFilter from "./control-types";
import DisciplinesFilter from "./disciplines";

const PerformanceFilter: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("flex gap-4", className)} {...props}>
      <DisciplinesFilter />
      <ControlTypesFilter />
    </div>
  );
};

export default PerformanceFilter;
