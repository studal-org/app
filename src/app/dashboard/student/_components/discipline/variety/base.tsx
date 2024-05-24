import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type FC, type ReactNode } from "react";

const DisciplineBase: FC<{ title: ReactNode }> = ({ title }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer">{title}</span>
      </PopoverTrigger>
      <PopoverContent className="w-full lg:w-50">
        <div className="text-sm text-muted-foreground">Дисциплина</div>
        <div>{title}</div>
      </PopoverContent>
    </Popover>
  );
};

export default DisciplineBase;
