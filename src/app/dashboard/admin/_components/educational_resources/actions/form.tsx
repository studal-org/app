"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type educationalResources } from "@/server/db/schema/educational-resources";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import EducationalResourceUI from "../item";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  buttonText: z.string().min(2).max(50),
  href: z.string().url(),
});

const EducationalResourcesUpsertForm: FC<{
  defaultValues?: typeof educationalResources.$inferInsert;
  onSuccess?: (data: typeof educationalResources.$inferSelect) => unknown;
}> = ({ defaultValues, onSuccess }) => {
  const { mutate, isPending } = api.educationalResources.upsert.useMutation({
    onSuccess: (data) => {
      onSuccess?.(data);
      toast.success("ЭОР сохранен");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      buttonText: defaultValues?.buttonText ?? "",
      href: defaultValues?.href ?? "",
    },
  });

  const currentData = form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ id: defaultValues?.id, ...values });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Группа ВКонтакте" {...field} />
                </FormControl>
                <FormDescription>Название ЭОРа</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Текст кнопки</FormLabel>
                <FormControl>
                  <Input placeholder="Вступить" {...field} />
                </FormControl>
                <FormDescription>Текст кнопки ЭОРа</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="href"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ссылка</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>Ссылка ЭОРа</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </form>
      </Form>
      <EducationalResourceUI
        educationalResourceUI={{ id: "", createdBy: "", ...currentData }}
      />
    </>
  );
};

export default EducationalResourcesUpsertForm;
