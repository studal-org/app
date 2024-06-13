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
      <h2 className="text-xl font-medium tracking-tight">
        Электронные образовательные ресурсы
      </h2>
      <div className="flex flex-col gap-2">
        <EducationalResourcesAdd className="w-fit" />
        <EducationalResourcesList />
      </div>
    </div>
  );
};

export default AdminEducationalResources;
