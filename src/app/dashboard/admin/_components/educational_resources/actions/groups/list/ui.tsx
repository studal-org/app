import { type RouterOutputs } from "@/trpc/shared";
import { type FC } from "react";

const EducationalResourcesGroupsItemUI: FC<{
  educationalResourcesGroupsItemUI: RouterOutputs["groups"]["read"];
}> = ({ educationalResourcesGroupsItemUI: { title } }) => <div>{title}</div>;

export default EducationalResourcesGroupsItemUI;
