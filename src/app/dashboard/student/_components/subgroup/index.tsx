import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { type ComponentProps, type FC } from "react";

const Subgroup: FC<
  ComponentProps<typeof Badge> & {
    subgroup: number;
  }
> = ({ subgroup, className, ...rest }) => {
  return (
    <Badge
      variant="outline"
      className={cn("bg-neutral-100", className)}
      {...rest}
    >
      <Users className="mr-1 h-3.5 w-3.5" />
      <div className="whitespace-pre">
        {subgroup} <span className="font-normal">подгруппа</span>
      </div>
    </Badge>
  );
};

export default Subgroup;
