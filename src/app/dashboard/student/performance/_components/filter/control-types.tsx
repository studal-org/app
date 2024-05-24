"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
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
import { useEffect, useState, type ComponentProps, type FC } from "react";
import { usePeriod } from "../../_hooks/period";
import { usePerformanceFilters } from "./provider";

type ControlTypesSelectedKey = string;
type ControlTypesSelectedValue = components["schemas"]["ControlType"];

const ControlTypesFilter: FC<ComponentProps<typeof Popover>> = (props) => {
  const [selected, setSelected] = useState(
    new Map<ControlTypesSelectedKey, ControlTypesSelectedValue>(),
  );
  const [filters, setFilters] = usePerformanceFilters();

  const setFilter = (
    key: ControlTypesSelectedKey,
    value: ControlTypesSelectedValue,
  ) => {
    const s = new Map(selected);
    if (s.has(key)) s.delete(key);
    else s.set(key, value);
    setSelected(s);
  };

  useEffect(() => {
    const f = new Map(filters);
    f.set("controlTypes", {
      predicate: ({ controlTypeId }) =>
        !selected.size || (controlTypeId && selected.has(controlTypeId)),
    });
    setFilters(f);
  }, [selected]);

  const [open, setOpen] = useState(false);
  const [period] = usePeriod();

  const [performance] = api.user.student.performance.read.useSuspenseQuery({
    ...period,
  });

  const [controlTypes] = api.useSuspenseQueries((t) =>
    [
      ...new Set(
        performance.flatMap(({ controlTypeId }) =>
          controlTypeId ? [controlTypeId] : [],
        ),
      ),
    ].map((id) => t.controlTypes.read({ id })),
  );

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
            ? `Выбрано типов контроля: ${selected.size}`
            : "Выберите тип контроля"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Поиск" />
          <CommandEmpty>Ничего не найдено</CommandEmpty>
          <CommandList>
            {controlTypes.map((item) => {
              return (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => setFilter(item.id, item)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      selected.has(item.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div>{item.title}</div>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ControlTypesFilter;
