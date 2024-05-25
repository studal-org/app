import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { atom, useAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { type FC, type HTMLAttributes } from "react";
import { performanceFiltersAtom } from ".";

const latesCheckedAtom = atom(false);

const updateFiltersAtom = atomEffect((get, set) => {
  const checked = get(latesCheckedAtom);
  const f = new Map(get.peek(performanceFiltersAtom));
  f.set("lates", {
    predicate: ({ isLate }) => (checked ? isLate : true),
  });
  set(performanceFiltersAtom, f);
});

const LatesFilter: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [checked, setChecked] = useAtom(latesCheckedAtom);
  useAtom(updateFiltersAtom);

  return (
    <div
      className={cn("flex items-center space-x-2 h-10", className)}
      {...props}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
        id="lates"
      />
      <label
        htmlFor="lates"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Только опоздания
      </label>
    </div>
  );
};

export default LatesFilter;
