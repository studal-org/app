"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandItemLoading,
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
import { atom, useAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Fragment,
  Suspense,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from "react";
import { performanceFiltersAtom } from ".";
import DisciplinesIcon from "../../../disciplines/_components/icon";
import { usePeriod } from "../../_hooks/period";

type DisciplinesSelectedKey = `${"discipline" | "practiceKind"}/${string}`;
type DisciplinesSelectedValue =
  | components["schemas"]["PracticeKind"]
  | components["schemas"]["Discipline"];

const selectedDisciplinesAtom = atom(
  new Map<DisciplinesSelectedKey, DisciplinesSelectedValue>(),
);

const updateFiltersAtom = atomEffect((get, set) => {
  const selected = get(selectedDisciplinesAtom);
  const f = new Map(get.peek(performanceFiltersAtom));
  f.set("disciplines", {
    predicate: ({ discipline: { objectType, objectId } }) =>
      !selected.size || selected.has(`${objectType}/${objectId}`),
  });
  set(performanceFiltersAtom, f);
});

const DisciplinesFilter: FC<ComponentProps<typeof Popover>> = (props) => {
  const [selected] = useAtom(selectedDisciplinesAtom);
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
            className="w-full justify-between"
          >
            <div className="flex items-center">
              <DisciplinesIcon className="mr-2 h-4 w-4" />
              {selected.size ? `Дисциплин: ${selected.size}` : "Дисциплины"}
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
              <Suspense fallback={<DisciplinesFilterContentLoading />}>
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

  const [disciplines] = api.useSuspenseQueries((t) =>
    [
      ...new Set(
        performance.flatMap(({ discipline: { objectType, objectId } }) =>
          objectType === "discipline" ? [objectId] : [],
        ),
      ),
    ].map((id) => t.disciplines.read({ id }, { staleTime: Infinity })),
  );

  const [practiceKinds] = api.useSuspenseQueries((t) =>
    [
      ...new Set(
        performance.flatMap(({ discipline: { objectType, objectId } }) =>
          objectType === "practiceKind" ? [objectId] : [],
        ),
      ),
    ].map((id) => t.practiceKinds.read({ id }, { staleTime: Infinity })),
  );

  const groups = useMemo(
    () =>
      [
        { title: "Дисциплины", id: "discipline", items: disciplines } as const,
        {
          title: "Практики",
          id: "practiceKind",
          items: practiceKinds,
        } as const,
      ] as const,
    [disciplines, practiceKinds],
  );

  const [selected, setSelected] = useAtom(selectedDisciplinesAtom);

  const setFilter = (
    key: DisciplinesSelectedKey,
    value: DisciplinesSelectedValue,
  ) => {
    const s = new Map(selected);
    if (s.has(key)) s.delete(key);
    else s.set(key, value);
    setSelected(s);
  };

  return (
    <>
      {groups.map(({ title, id, items }, index, array) => (
        <Fragment key={id}>
          <CommandGroup heading={title}>
            {items.map((item) => {
              const key = `${id}/${item.id}` as const;
              return (
                <CommandItem
                  key={key}
                  value={item.title}
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
    </>
  );
};

const DisciplinesFilterContentLoading: FC = () => (
  <>
    {[...Array(3).keys()].map((i) => (
      <CommandItemLoading key={i} />
    ))}
  </>
);

export default DisciplinesFilter;
