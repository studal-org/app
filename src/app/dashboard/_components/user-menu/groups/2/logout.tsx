"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { useState } from "react";

const useLogout = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const logout = api.auth.logout.useMutation({
    onSuccess() {
      router.push("/");
      router.refresh();
      setAlertOpen(false);
    },
  });
  const alert = (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Выйти</AlertDialogTitle>
          <AlertDialogDescription>
            Вы действительно хотите выйти?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={logout.isPending}>
            Отменить
          </AlertDialogCancel>
          <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
            Выйти
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const item = (
    <DropdownMenuItem onClick={() => setAlertOpen(true)}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Выйти</span>
    </DropdownMenuItem>
  );

  return { item, components: [alert] };
};

export default useLogout;
