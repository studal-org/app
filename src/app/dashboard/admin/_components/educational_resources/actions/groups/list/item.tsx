import { type RouterOutputs } from "@/trpc/shared";
import { type FC } from "react";
import EducationalResourcesGroupsItemRemove from "./remove";
import EducationalResourcesGroupsItemUI from "./ui";

const EducationalResourcesGroupsItem: FC<{
  educationalResourcesGroupsItem: {
    educationalResource: RouterOutputs["educationalResources"]["read"];
    group: RouterOutputs["groups"]["read"];
  };
}> = ({ educationalResourcesGroupsItem: { group, educationalResource } }) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <EducationalResourcesGroupsItemUI
        educationalResourcesGroupsItemUI={group}
      />
      <EducationalResourcesGroupsItemRemove
        educationalResourcesGroupsItemRemove={{ group, educationalResource }}
      />
    </div>
  );
};

export default EducationalResourcesGroupsItem;
