"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { format } from "date-fns";
import { Clock, Notebook, Shapes, UserX } from "lucide-react";
import type { FC } from "react";
import { usePeriod } from "../../../_hooks/period";
import Discipline from "../../discipline";
import Mark from "../../mark";

type PerformanceElement =
  RouterOutputs["user"]["student"]["performance"]["read"][number];

const PerformanceByDate: FC = () => {
  const [period] = usePeriod();

  const [performance] = api.user.student.performance.read.useSuspenseQuery({
    ...period,
  });

  const [disciplines] = api.useSuspenseQueries((t) =>
    [
      ...performance.reduce((acc, { discipline }) => {
        const disciplineKey = `${discipline.objectType}/${discipline.objectId}`;
        if (!acc.has(disciplineKey) && discipline.objectType === "discipline")
          acc.set(disciplineKey, discipline);
        return acc;
      }, new Map<string, PerformanceElement["discipline"]>()),
    ].flatMap(([_, { objectType, objectId }]) =>
      objectType === "discipline" ? [t.disciplines.read({ id: objectId })] : [],
    ),
  );
  const [practiceKinds] = api.useSuspenseQueries((t) =>
    [
      ...performance.reduce((acc, { discipline }) => {
        const disciplineKey = `${discipline.objectType}/${discipline.objectId}`;
        if (!acc.has(disciplineKey) && discipline.objectType === "practiceKind")
          acc.set(disciplineKey, discipline);
        return acc;
      }, new Map<string, PerformanceElement["discipline"]>()),
    ].flatMap(([_, { objectType, objectId }]) =>
      objectType === "practiceKind"
        ? [t.practiceKinds.read({ id: objectId })]
        : [],
    ),
  );

  const [controlTypes] = api.useSuspenseQueries((t) =>
    [
      ...performance.reduce((acc, v) => {
        if (v.controlTypeId) acc.add(v.controlTypeId);
        return acc;
      }, new Set<string>()),
    ].map((id) => t.controlTypes.read({ id })),
  );

  const [workTypes] = api.useSuspenseQueries((t) =>
    [
      ...performance.reduce((acc, v) => {
        if (v.workTypeId) acc.add(v.workTypeId);
        return acc;
      }, new Set<string>()),
    ].map((id) => t.workTypes.read({ id })),
  );

  const performanceByDate = [
    ...performance.reduce((acc, v) => {
      const date = new Date(v.date);
      const dateKey = date.getTime();
      const forDate = acc.get(dateKey);
      if (!forDate) acc.set(dateKey, { date: date, performanceForDate: [v] });
      else forDate.performanceForDate.push(v);
      return acc;
    }, new Map<number, { date: Date; performanceForDate: PerformanceElement[] }>()),
  ].toSorted(([a], [b]) => b - a);

  return (
    <div className="flex flex-col gap-4">
      {[...performanceByDate].map(([dateKey, { date, performanceForDate }]) => (
        <Card key={dateKey} className="bg-card/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium uppercase text-muted-foreground">
              {format(date, "d MMM y, iiiiii")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {performanceForDate.map((document) => {
              const determineDiscipline = () => {
                if (document.discipline.objectType === "discipline") {
                  const discipline = disciplines.find(
                    (d) => d.id === document.discipline.objectId,
                  );
                  return (
                    discipline && {
                      type: "discipline" as const,
                      object: discipline,
                    }
                  );
                }
                if (document.discipline.objectType === "practiceKind") {
                  const practiceKind = practiceKinds.find(
                    (d) => d.id === document.discipline.objectId,
                  );
                  return (
                    practiceKind && {
                      type: "practiceKind" as const,
                      object: practiceKind,
                    }
                  );
                }
                return undefined;
              };

              const discipline = determineDiscipline();

              const controlType = controlTypes.find(
                (ct) => ct.id === document.controlTypeId,
              );
              const workType = workTypes.find(
                (wt) => wt.id === document.workTypeId,
              );
              return (
                <div
                  key={`${document.objectType}/${document.objectId}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <Discipline discipline={discipline} />
                    <div className="flex gap-1 flex-wrap">
                      {controlType && (
                        <Badge variant="outline" className="bg-neutral-50">
                          <Shapes className="mr-1 h-3.5 w-3.5" />
                          {controlType.title}
                        </Badge>
                      )}
                      {workType && (
                        <Badge variant="outline" className="bg-neutral-100">
                          <Notebook className="mr-1 h-3.5 w-3.5" />
                          {workType.title}
                        </Badge>
                      )}
                      {document.isAttended === false && (
                        <Badge variant="outline" className="bg-red-50">
                          <UserX className="mr-1 h-3.5 w-3.5" />
                          Неявка
                        </Badge>
                      )}
                      {document.isLate === true && (
                        <Badge variant="outline" className="bg-yellow-50">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          Опоздание
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {document.marks.map((mark) => (
                      <Mark key={mark.number} {...mark} />
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceByDate;
