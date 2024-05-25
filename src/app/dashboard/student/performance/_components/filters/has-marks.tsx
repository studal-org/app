import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { atom, useAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { type FC, type HTMLAttributes } from "react";
import { performanceFiltersAtom } from ".";

const hasMarksCheckedAtom = atom(true);

const updateFiltersAtom = atomEffect((get, set) => {
  const checked = get(hasMarksCheckedAtom);
  const f = new Map(get.peek(performanceFiltersAtom));
  f.set("hasMarks", {
    predicate: ({ marks }) => (checked ? marks.length : true),
  });
  set(performanceFiltersAtom, f);
});

const HasMarksFilter: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [checked, setChecked] = useAtom(hasMarksCheckedAtom);
  useAtom(updateFiltersAtom);

  return (
    <div
      className={cn("flex items-center space-x-2 h-10", className)}
      {...props}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
        id="hasMarks"
      />
      <label
        htmlFor="hasMarks"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Только с оценками
      </label>
    </div>
  );
};

export default HasMarksFilter;
