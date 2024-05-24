import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { format } from "date-fns";
import { type FC, type HTMLAttributes } from "react";
import Discipline from "../../../../../_components/discipline";
import PerformanceElement from "../../../performance-element";

const PerformanceByDiscipline: FC<
  HTMLAttributes<HTMLDivElement> & {
    performance: components["schemas"]["StudentPerformance"][];
  }
> = ({ performance, className, ...props }) => {
  // const [period] = usePeriod();
  // const [performance] = api.user.student.performance.read.useSuspenseQuery({
  //   ...period,
  // });

  const performanceByDiscipline = performance.reduce((acc, v) => {
    const discipline = v.discipline;
    const disciplineKey =
      `${v.discipline.objectType}/${v.discipline.objectId}` as const;
    const forDiscipline = acc.get(disciplineKey);
    if (!forDiscipline)
      acc.set(disciplineKey, {
        discipline,
        performanceForDiscipline: [v],
      });
    else forDiscipline.performanceForDiscipline.push(v);
    return acc;
  }, new Map<`${string}/${string}`, { discipline: components["schemas"]["StudentPerformance"]["discipline"]; performanceForDiscipline: typeof performance }>());

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {[...performanceByDiscipline].map(
        ([disciplineKey, { discipline, performanceForDiscipline }]) => (
          <Card key={disciplineKey} className="bg-card/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium uppercase text-muted-foreground">
                <Discipline discipline={discipline} />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {performanceForDiscipline.map((document) => (
                <PerformanceElement
                  key={`${document.objectType}/${document.objectId}`}
                  {...document}
                  title={<div>{format(document.date, "d MMM y, iiiiii")}</div>}
                />
              ))}
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
};

export default PerformanceByDiscipline;
