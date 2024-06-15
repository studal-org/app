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
import { cn } from "@/lib/utils";
import { type educationalResources } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type FC } from "react";
import { toast } from "sonner";
import EducationalResourceUI from "../item";

const EducationalResourcesDelete: FC<
  ComponentProps<typeof Button> & {
    educationalResourcesDelete: {
      educationalResourceUI: RouterOutputs["educationalResources"]["read"];
      onSuccess?: (data: typeof educationalResources.$inferSelect) => unknown;
    };
  }
> = ({
  educationalResourcesDelete: { educationalResourceUI, onSuccess },
  ...props
}) => {
  const router = useRouter();
  const { id } = educationalResourceUI;

  const { mutate, isPending } = api.educationalResources.delete.useMutation({
    onSuccess: (data) => {
      onSuccess?.(data);
      setOpen(false);
      toast.success("ЭОР удален");
      router.refresh();
    },
  });

  function onSubmit() {
    mutate({ id });
  }

  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className={cn("text-destructive")}
          variant="secondary"
          size="sm"
          {...props}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление ЭОРа</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <EducationalResourceUI educationalResourceUI={educationalResourceUI} />
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

export default EducationalResourcesDelete;
