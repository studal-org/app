"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import EducationalResourceUI from "../../../item";
import EducationalResourcesGroupsItemUI from "./ui";

const EducationalResourcesGroupsItemRemove: FC<{
  educationalResourcesGroupsItemRemove: {
    educationalResource: RouterOutputs["educationalResources"]["read"];
    group: RouterOutputs["groups"]["read"];
  };
}> = ({
  educationalResourcesGroupsItemRemove: { group, educationalResource },
}) => {
  const router = useRouter();
  const { mutate, isPending } =
    api.educationalResources.removeGroup.useMutation({
      onSuccess: () => router.refresh(),
    });

  const onSubmit = () => {
    mutate({ id: educationalResource.id, groupId: group.id });
  };

  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление группы для ЭОРа</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <EducationalResourceUI educationalResourceUI={educationalResource} />
        <EducationalResourcesGroupsItemUI
          educationalResourcesGroupsItemUI={group}
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отменить</AlertDialogCancel>
          <Button variant="destructive" disabled={isPending} onClick={onSubmit}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Удалить
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EducationalResourcesGroupsItemRemove;
