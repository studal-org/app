import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { type ComponentProps, type FC } from "react";
import Classroom from "../../../_components/classroom";
import Discipline from "../../../_components/discipline";
import Subgroup from "../../../_components/subgroup";
import Teacher from "../../../_components/teacher";
import WorkType from "../../../_components/work-type";

const PeriodClass: FC<
  ComponentProps<typeof Card> & {
    periodClass: components["schemas"]["Period_AsItem"];
  }
> = ({ periodClass, className, ...props }) => {
  const { discipline, subgroup, workTypeId, classroomId, teacherId } =
    periodClass;

  return (
    <Card className={cn("bg-card/40 flex flex-col", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground/85">
          <Discipline discipline={discipline} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 flex-wrap">
          {subgroup !== null && subgroup > 0 && (
            <Subgroup subgroup={subgroup} />
          )}
          {classroomId && <Classroom classroom={{ id: classroomId }} />}
          {teacherId && <Teacher employee={{ id: teacherId }} />}
          {workTypeId && <WorkType workType={{ id: workTypeId }} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodClass;
