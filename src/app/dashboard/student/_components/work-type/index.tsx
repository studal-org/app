import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Notebook } from "lucide-react";
import { type ComponentProps, type FC } from "react";

const WorkType: FC<
  ComponentProps<typeof Badge> & {
    workType: { id: string };
  }
> = ({ workType: { id }, className, ...rest }) => {
  const [{ title }] = api.workTypes.read.useSuspenseQuery({ id });
  return (
    <Badge
      variant="outline"
      className={cn("bg-neutral-100", className)}
      {...rest}
    >
      <Notebook className="mr-1 h-3.5 w-3.5" />
      {title}
    </Badge>
  );
};
export default WorkType;
