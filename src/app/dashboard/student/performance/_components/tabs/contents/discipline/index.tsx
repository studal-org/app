import NotFound from "@/components/not-found";
import { type components } from "@/server/lib/agents/college/defs";
import { format } from "date-fns";
import { useMemo, type FC } from "react";
import Discipline from "../../../../../_components/discipline";
import PerformanceElement from "../performance-element";
import {
  PerformanceElementGroup,
  PerformanceElementGroupContent,
  PerformanceElementGroupHeader,
  PerformanceElementGroupTitle,
} from "../performance-element/group";

const PerformanceByDiscipline: FC<{
  performance: components["schemas"]["StudentPerformance"][];
}> = ({ performance }) => {
  const _performanceByDiscipline = useMemo(
    () =>
      performance.reduce((acc, v) => {
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
      }, new Map<`${string}/${string}`, { discipline: components["schemas"]["StudentPerformance"]["discipline"]; performanceForDiscipline: typeof performance }>()),
    [performance],
  );

  const performanceByDiscipline = useMemo(
    () => [..._performanceByDiscipline],
    [_performanceByDiscipline],
  );

  if (!performanceByDiscipline.length) return <NotFound />;

  return (
    <>
      {performanceByDiscipline.map(
        ([disciplineKey, { discipline, performanceForDiscipline }]) => (
          <PerformanceElementGroup key={disciplineKey}>
            <PerformanceElementGroupHeader>
              <PerformanceElementGroupTitle>
                <div>
                  <Discipline discipline={discipline} />
                </div>
              </PerformanceElementGroupTitle>
            </PerformanceElementGroupHeader>
            <PerformanceElementGroupContent>
              {performanceForDiscipline.map((document) => (
                <PerformanceElement
                  key={`${document.objectType}/${document.objectId}`}
                  {...document}
                  title={<div>{format(document.date, "d MMM y, iiiiii")}</div>}
                />
              ))}
            </PerformanceElementGroupContent>
          </PerformanceElementGroup>
        ),
      )}
    </>
  );
};

export default PerformanceByDiscipline;
