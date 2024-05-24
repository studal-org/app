import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { DoorOpen } from "lucide-react";
import { type ComponentProps, type FC } from "react";

const Classroom: FC<
  ComponentProps<typeof Badge> & {
    classroom: { id: string };
  }
> = ({ classroom: { id }, className, ...rest }) => {
  const [{ number }] = api.classrooms.read.useSuspenseQuery({ id });
  return (
    <Badge
      variant="outline"
      className={cn("bg-neutral-100", className)}
      {...rest}
    >
      <DoorOpen className="mr-1 h-3.5 w-3.5" />
      <div className="whitespace-pre">
        {number} <span className="font-normal">аудитория</span>
      </div>
    </Badge>
  );
};

export default Classroom;
