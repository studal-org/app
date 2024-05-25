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
import WorkTypesIcon from "../../../work-types/_components/icon";
import { usePeriod } from "../../_hooks/period";

type WorkTypesSelectedKey = string;
type WorkTypesSelectedValue = components["schemas"]["WorkType"];

const selectedWorkTypesAtom = atom(
  new Map<WorkTypesSelectedKey, WorkTypesSelectedValue>(),
);

const updateFiltersAtom = atomEffect((get, set) => {
  const selected = get(selectedWorkTypesAtom);
  const f = new Map(get.peek(performanceFiltersAtom));
  f.set("workTypes", {
    predicate: ({ workTypeId }) =>
      !selected.size || (workTypeId && selected.has(workTypeId)),
  });
  set(performanceFiltersAtom, f);
});

const WorkTypesFilter: FC<ComponentProps<typeof Popover>> = (props) => {
  const [selected] = useAtom(selectedWorkTypesAtom);
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
              <WorkTypesIcon className="w-4 h-4 mr-2" />
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
              <Suspense fallback={<WorkTypesFilterContentLoading />}>
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

  const [workTypes] = api.useSuspenseQueries((t) =>
    [
      ...new Set(
        performance.flatMap(({ workTypeId }) =>
          workTypeId ? [workTypeId] : [],
        ),
      ),
    ].map((id) => t.workTypes.read({ id }, { staleTime: Infinity })),
  );

  const [selected, setSelected] = useAtom(selectedWorkTypesAtom);

  const setFilter = (
    key: WorkTypesSelectedKey,
    value: WorkTypesSelectedValue,
  ) => {
    const s = new Map(selected);
    if (s.has(key)) s.delete(key);
    else s.set(key, value);
    setSelected(s);
  };

  return (
    <>
      {workTypes.map((item) => (
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

const WorkTypesFilterContentLoading: FC = () => (
  <>
    {[...Array(3).keys()].map((i) => (
      <CommandItemLoading key={i} />
    ))}
  </>
);

export default WorkTypesFilter;
