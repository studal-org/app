import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { atom, useAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { type FC, type HTMLAttributes } from "react";
import { performanceFiltersAtom } from ".";

const noShowsCheckedAtom = atom(false);

const updateFiltersAtom = atomEffect((get, set) => {
  const checked = get(noShowsCheckedAtom);
  const f = new Map(get.peek(performanceFiltersAtom));
  f.set("noShows", {
    predicate: ({ isAttended }) =>
      checked ? (isAttended === false ? true : false) : true,
  });
  set(performanceFiltersAtom, f);
});

const NoShowsFilter: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [checked, setChecked] = useAtom(noShowsCheckedAtom);
  useAtom(updateFiltersAtom);

  return (
    <div
      className={cn("flex items-center space-x-2 h-10", className)}
      {...props}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
        id="no-shows"
      />
      <label
        htmlFor="no-shows"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Только неявки
      </label>
    </div>
  );
};

export default NoShowsFilter;
