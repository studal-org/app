import { type components } from "@/server/lib/agents/college/defs";
import { format } from "date-fns";
import type { FC } from "react";
import Discipline from "../../../../../_components/discipline";
import PerformanceElement from "../performance-element";
import {
  PerformanceElementGroup,
  PerformanceElementGroupContent,
  PerformanceElementGroupHeader,
  PerformanceElementGroupTitle,
} from "../performance-element/group";

const PerformanceByDate: FC<{
  performance: components["schemas"]["StudentPerformance"][];
}> = ({ performance }) => {
  const performanceByDate = performance.reduce((acc, v) => {
    const date = new Date(v.date);
    const dateKey = date.getTime();
    const forDate = acc.get(dateKey);
    if (!forDate) acc.set(dateKey, { date: date, performanceForDate: [v] });
    else forDate.performanceForDate.push(v);
    return acc;
  }, new Map<number, { date: Date; performanceForDate: components["schemas"]["StudentPerformance"][] }>());

  return (
    <>
      {[...performanceByDate].map(([dateKey, { date, performanceForDate }]) => (
        <PerformanceElementGroup key={dateKey}>
          <PerformanceElementGroupHeader>
            <PerformanceElementGroupTitle>
              {format(date, "d MMM y, iiiiii")}
            </PerformanceElementGroupTitle>
          </PerformanceElementGroupHeader>
          <PerformanceElementGroupContent>
            {performanceForDate.map((document) => (
              <PerformanceElement
                key={`${document.objectType}/${document.objectId}`}
                {...document}
                title={<Discipline discipline={document.discipline} />}
              />
            ))}
          </PerformanceElementGroupContent>
        </PerformanceElementGroup>
      ))}
    </>
  );
};

export default PerformanceByDate;
