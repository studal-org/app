"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemLoading,
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
import { atom, useAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Suspense,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from "react";
import { performanceFiltersAtom } from ".";
import ControlTypesIcon from "../../../control-types/_components/icon";
import { usePeriod } from "../../_hooks/period";

type ControlTypesSelectedKey = string;
type ControlTypesSelectedValue = components["schemas"]["ControlType"];

const selectedControlTypesAtom = atom(
  new Map<ControlTypesSelectedKey, ControlTypesSelectedValue>(),
);

const updateFiltersAtom = atomEffect((get, set) => {
  const selected = get(selectedControlTypesAtom);
  const f = new Map(get.peek(performanceFiltersAtom));
  f.set("controlTypes", {
    predicate: ({ controlTypeId }) =>
      !selected.size || (controlTypeId && selected.has(controlTypeId)),
  });
  set(performanceFiltersAtom, f);
});

const ControlTypesFilter: FC<ComponentProps<typeof Popover>> = (props) => {
  const [selected] = useAtom(selectedControlTypesAtom);
  useAtom(updateFiltersAtom);

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            <div className="flex items-center">
              <ControlTypesIcon className="w-4 h-4 mr-2" />
              {selected.size
                ? `Виды контроля: ${selected.size}`
                : "Виды контроля"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{
            width: containerRef.current?.offsetWidth,
          }}
          container={containerRef.current}
        >
          <Command>
            <CommandInput placeholder="Поиск" />
            <CommandEmpty>Ничего не найдено</CommandEmpty>
            <CommandList>
              <Suspense fallback={<ControlTypesFilterContentLoading />}>
                <DisciplinesFilterContent />
              </Suspense>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const DisciplinesFilterContent: FC = () => {
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
    ].map((id) => t.controlTypes.read({ id }, { staleTime: Infinity })),
  );

  const [selected, setSelected] = useAtom(selectedControlTypesAtom);

  const setFilter = (
    key: ControlTypesSelectedKey,
    value: ControlTypesSelectedValue,
  ) => {
    const s = new Map(selected);
    if (s.has(key)) s.delete(key);
    else s.set(key, value);
    setSelected(s);
  };

  return (
    <>
      {controlTypes.map((item) => (
        <CommandItem
          key={item.id}
          value={item.title}
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
      ))}
    </>
  );
};

const ControlTypesFilterContentLoading: FC = () => (
  <>
    {[...Array(3).keys()].map((i) => (
      <CommandItemLoading key={i} />
    ))}
  </>
);

export default ControlTypesFilter;
