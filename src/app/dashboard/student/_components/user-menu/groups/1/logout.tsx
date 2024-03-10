"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const useLogout = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const logout = api.auth.logout.useMutation({
    onSuccess() {
      router.push("/");
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
          <AlertDialogCancel disabled={logout.isLoading}>
            Отменить
          </AlertDialogCancel>
          <Button onClick={() => logout.mutate()} disabled={logout.isLoading}>
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
