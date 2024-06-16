import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/trpc/server";
import { type RouterOutputs } from "@/trpc/shared";
import { Users } from "lucide-react";
import { type FC } from "react";
import EducationalResourcesGroupsAdd from "./add";
import EducationalResourcesGroupsItem from "./list/item";

const EducationalResourcesGroups: FC<{
  educationalResourcesGroups: RouterOutputs["educationalResources"]["read"];
}> = async ({ educationalResourcesGroups }) => {
  const { id } = educationalResourcesGroups;
  const groups = await api.educationalResources.listGroups({ id });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">
          <Users className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Группы ЭОРа</SheetTitle>
        </SheetHeader>
        <div>
          {groups.map(({ group }) => (
            <EducationalResourcesGroupsItem
              key={group.id}
              educationalResourcesGroupsItem={{
                group,
                educationalResource: educationalResourcesGroups,
              }}
            />
          ))}
        </div>
        <EducationalResourcesGroupsAdd
          educationalResourcesGroupsAdd={{
            educationalResource: educationalResourcesGroups,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EducationalResourcesGroups;
