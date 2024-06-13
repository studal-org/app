"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type RouterOutputs } from "@/trpc/shared";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type FC } from "react";
import EducationalResourcesUpsertForm from "./form";

export const EducationalResourcesEdit: FC<
  ComponentProps<typeof Button> & {
    educationalResourcesEdit: {
      educationalResourcesUpsertForm: RouterOutputs["educationalResources"]["read"];
    };
  }
> = ({
  educationalResourcesEdit: { educationalResourcesUpsertForm },
  ...props
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...props} variant="secondary" size="sm">
          <Pencil className="h-4 w-4 mr-2" /> Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать ЭОР</DialogTitle>
        </DialogHeader>
        <EducationalResourcesUpsertForm
          defaultValues={educationalResourcesUpsertForm}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
