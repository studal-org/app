import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type components } from "@/server/lib/agents/college/defs";
import { format } from "date-fns";
import type { FC, HTMLAttributes } from "react";
import Discipline from "../../../../../_components/discipline";
import PerformanceElement from "../../../performance-element";

const PerformanceByDate: FC<
  HTMLAttributes<HTMLDivElement> & {
    performance: components["schemas"]["StudentPerformance"][];
  }
> = ({ performance, className, ...props }) => {
  const performanceByDate = performance.reduce((acc, v) => {
    const date = new Date(v.date);
    const dateKey = date.getTime();
    const forDate = acc.get(dateKey);
    if (!forDate) acc.set(dateKey, { date: date, performanceForDate: [v] });
    else forDate.performanceForDate.push(v);
    return acc;
  }, new Map<number, { date: Date; performanceForDate: components["schemas"]["StudentPerformance"][] }>());

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {[...performanceByDate].map(([dateKey, { date, performanceForDate }]) => (
        <Card key={dateKey} className="bg-card/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium uppercase text-muted-foreground">
              {format(date, "d MMM y, iiiiii")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {performanceForDate.map((document) => (
              <PerformanceElement
                key={`${document.objectType}/${document.objectId}`}
                {...document}
                title={<Discipline discipline={document.discipline} />}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceByDate;
