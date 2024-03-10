"use client";

import { useState, type FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Некорректная электронная почта" }),
});

const EmailMethod: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initiateEmailAuth = api.auth.email.initiate.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await initiateEmailAuth.mutateAsync(values, {
      onError: ({ data }) => {
        if (data?.code === "NOT_FOUND")
          toast.error("Не смогли найти вас 😥", {
            description:
              "Пользователь с такой электронной почтой не существует",
          });

        setIsLoading(false);
      },
    });
    setIsAlertOpen(true);
    setIsLoading(false);
  };

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отправили ссылку на почту</AlertDialogTitle>
            <AlertDialogDescription>
              <div>Чтобы войти, перейдите по ссылке в письме.</div>
              <div>Эту вкладку можно закрыть.</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Закрыть</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Электронная почта</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Продолжить
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EmailMethod;
