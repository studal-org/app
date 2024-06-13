"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type FC } from "react";
import EducationalResourcesUpsertForm from "./form";

export const EducationalResourcesAdd: FC<ComponentProps<typeof Button>> = (
  props,
) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...props}>Добавить</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить ЭОР</DialogTitle>
        </DialogHeader>
        <EducationalResourcesUpsertForm
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
