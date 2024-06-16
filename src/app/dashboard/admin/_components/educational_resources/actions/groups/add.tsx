"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { atom, useAtom } from "jotai";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useRef, type FC, type HTMLAttributes } from "react";

const pickedGroupAtom = atom("");
const popoverOpenAtom = atom(false);

const EducationalResourcesGroupsAdd: FC<
  HTMLAttributes<HTMLDivElement> & {
    educationalResourcesGroupsAdd: {
      educationalResource: RouterOutputs["educationalResources"]["read"];
    };
  }
> = ({
  educationalResourcesGroupsAdd: { educationalResource },
  className,
  ...props
}) => {
  const router = useRouter();
  const { mutate, isPending } = api.educationalResources.addGroup.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const [pickedGroup] = useAtom(pickedGroupAtom);
  const [open, setOpen] = useAtom(popoverOpenAtom);

  const onSubmit = () => {
    if (pickedGroup)
      mutate({ id: educationalResource.id, groupId: pickedGroup });
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            <Suspense fallback={"loading"}>
              <ButtonContent />
            </Suspense>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          {...props}
          style={{
            width: containerRef.current?.offsetWidth,
          }}
          container={containerRef.current}
        >
          <Command>
            <CommandInput placeholder="Поиск группы.." />
            <CommandEmpty>Группа не найдена</CommandEmpty>
            <CommandGroup>
              <Suspense>
                <GroupPickerContent />
              </Suspense>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Button disabled={isPending || !pickedGroup} onClick={onSubmit}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Добавить
      </Button>
    </div>
  );
};

const ButtonContent: FC = ({}) => {
  const [groups] = api.groups.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  });
  const [pickedGroup] = useAtom(pickedGroupAtom);
  return pickedGroup
    ? groups.find(({ id }) => id === pickedGroup)?.title
    : "Выберите группу";
};

const GroupPickerContent: FC = () => {
  const [groups] = api.groups.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  });
  const [pickedGroup, setPickedGroup] = useAtom(pickedGroupAtom);
  const [_, setOpen] = useAtom(popoverOpenAtom);
  return (
    <>
      {groups.map(({ id, title }) => (
        <CommandItem
          key={id}
          value={title}
          onSelect={() => {
            setPickedGroup(id === pickedGroup ? "" : id);
            setOpen(false);
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              pickedGroup === id ? "opacity-100" : "opacity-0",
            )}
          />
          {title}
        </CommandItem>
      ))}
    </>
  );
};

export default EducationalResourcesGroupsAdd;
