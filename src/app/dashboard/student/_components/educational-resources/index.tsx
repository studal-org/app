import { cn } from "@/lib/utils";
import { type FC, type HTMLAttributes } from "react";
import EducationalResourcesList from "./list";

const StudentEducationalResources: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("", className)} {...props}>
      <h2 className="text-xl font-medium tracking-tight">
        Электронные образовательные ресурсы
      </h2>
      <EducationalResourcesList />
    </div>
  );
};

export default StudentEducationalResources;
