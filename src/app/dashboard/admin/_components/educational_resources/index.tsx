import { cn } from "@/lib/utils";
import { type FC, type HTMLAttributes } from "react";
import { EducationalResourcesAdd } from "./actions/add";
import EducationalResourcesList from "./list";

const AdminEducationalResources: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium tracking-tight">
          Электронные образовательные ресурсы
        </h2>
        <EducationalResourcesAdd className="w-fit" />
      </div>
      <EducationalResourcesList />
    </div>
  );
};

export default AdminEducationalResources;
