import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { User } from "lucide-react";
import { type ComponentProps, type FC } from "react";

const Teacher: FC<
  ComponentProps<typeof Badge> & {
    employee: { id: string };
  }
> = ({ employee: { id }, className, ...rest }) => {
  const [{ individualId }] = api.employees.read.useSuspenseQuery({ id });
  return (
    <Badge
      variant="outline"
      className={cn("bg-neutral-100", className)}
      {...rest}
    >
      <User className="mr-1 h-3.5 w-3.5" />
      {individualId ? <IndividualName id={individualId} /> : "Неопределено"}
    </Badge>
  );
};

const IndividualName: FC<{ id: string }> = ({ id }) => {
  const [{ fullName, name }] = api.individuals.read.useSuspenseQuery({ id });

  if (name) {
    const { first, middle, last } = name;
    return `${last} ${first.at(0)}. ${middle.at(0)}.`;
  }
  if (fullName) return fullName;
  return "Неопределено";
};

export default Teacher;
