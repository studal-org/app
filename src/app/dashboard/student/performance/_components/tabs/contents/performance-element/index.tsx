import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/shared";
import { Clock, UserX } from "lucide-react";
import { type FC, type ReactNode } from "react";
import ControlType from "../../../../../_components/control-type";
import WorkType from "../../../../../_components/work-type";
import Mark from "./mark";

const PerformanceElement: FC<
  RouterOutputs["user"]["student"]["performance"]["read"][number] & {
    title: ReactNode;
  }
> = ({ title, workTypeId, controlTypeId, isAttended, isLate, marks }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        {title}
        <div className="flex gap-1 flex-wrap">
          {controlTypeId && <ControlType controlType={{ id: controlTypeId }} />}
          {workTypeId && <WorkType workType={{ id: workTypeId }} />}
          {isAttended === false && (
            <Badge variant="outline" className="bg-red-50">
              <UserX className="mr-1 h-3.5 w-3.5" />
              Неявка
            </Badge>
          )}
          {isLate === true && (
            <Badge variant="outline" className="bg-yellow-50">
              <Clock className="mr-1 h-3.5 w-3.5" />
              Опоздание
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {marks.map((mark) => (
          <Mark key={mark.number} {...mark} />
        ))}
      </div>
    </div>
  );
};

export default PerformanceElement;
