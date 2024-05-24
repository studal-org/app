"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { api } from "@/trpc/react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Fragment,
  useEffect,
  useState,
  type ComponentProps,
  type FC,
} from "react";
import { usePeriod } from "../../_hooks/period";
import { usePerformanceFilters } from "./provider";

type DisciplinesSelectedKey = `${"discipline" | "practiceKind"}/${string}`;
type DisciplinesSelectedValue =
  | components["schemas"]["PracticeKind"]
  | components["schemas"]["Discipline"];

const DisciplinesFilter: FC<ComponentProps<typeof Popover>> = (props) => {
  const [selected, setSelected] = useState(
    new Map<DisciplinesSelectedKey, DisciplinesSelectedValue>(),
  );
  const [filters, setFilters] = usePerformanceFilters();

  const setFilter = (
    key: DisciplinesSelectedKey,
    value: DisciplinesSelectedValue,
  ) => {
    const s = new Map(selected);
    if (s.has(key)) s.delete(key);
    else s.set(key, value);
    setSelected(s);
  };

  useEffect(() => {
    const f = new Map(filters);
    f.set("disciplines", {
      predicate: ({ discipline: { objectType, objectId } }) =>
        !selected.size || selected.has(`${objectType}/${objectId}`),
    });
    setFilters(f);
  }, [selected]);

  const [open, setOpen] = useState(false);
  const [period] = usePeriod();

  const [performance] = api.user.student.performance.read.useSuspenseQuery({
    ...period,
  });

  const [disciplines] = api.useSuspenseQueries((t) =>
    [
      ...new Set(
        performance.flatMap(({ discipline: { objectType, objectId } }) =>
          objectType === "discipline" ? [objectId] : [],
        ),
      ),
    ].map((id) => t.disciplines.read({ id })),
  );

  const [practiceKinds] = api.useSuspenseQueries((t) =>
    [
      ...new Set(
        performance.flatMap(({ discipline: { objectType, objectId } }) =>
          objectType === "practiceKind" ? [objectId] : [],
        ),
      ),
    ].map((id) => t.practiceKinds.read({ id })),
  );

  const groups = [
    { title: "Дисциплины", id: "discipline", items: disciplines } as const,
    { title: "Практики", id: "practiceKind", items: practiceKinds } as const,
  ] as const;

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selected.size
            ? `Выбрано дисциплин: ${selected.size}`
            : "Выберите дисциплину"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Поиск" />
          <CommandEmpty>Ничего не найдено</CommandEmpty>
          <CommandList>
            {groups.map(({ title, id, items }, index, array) => (
              <Fragment key={id}>
                <CommandGroup heading={title}>
                  {items.map((item) => {
                    const key = `${id}/${item.id}` as const;
                    return (
                      <CommandItem
                        key={key}
                        value={key}
                        onSelect={() => setFilter(key, item)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            selected.has(key) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div>{item.title}</div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {array.length > index + 1 && <CommandSeparator />}
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DisciplinesFilter;
