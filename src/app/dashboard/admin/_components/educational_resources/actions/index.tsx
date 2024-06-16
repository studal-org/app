import { cn } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/shared";
import { type FC, type HTMLAttributes } from "react";
import EducationalResourcesDelete from "./delete";
import { EducationalResourcesEdit } from "./edit";
import EducationalResourcesGroups from "./groups";

const EducationalResourcesActions: FC<
  HTMLAttributes<HTMLDivElement> & {
    educationalResourcesActions: RouterOutputs["educationalResources"]["read"];
  }
> = ({ educationalResourcesActions, className, ...props }) => (
  <div className={cn("flex gap-1", className)} {...props}>
    <EducationalResourcesEdit
      className="w-full"
      educationalResourcesEdit={{
        educationalResourcesUpsertForm: educationalResourcesActions,
      }}
    />
    <EducationalResourcesDelete
      className="w-full"
      educationalResourcesDelete={{
        educationalResourceUI: educationalResourcesActions,
      }}
    />
    <EducationalResourcesGroups
      educationalResourcesGroups={educationalResourcesActions}
    />
  </div>
);

export default EducationalResourcesActions;
