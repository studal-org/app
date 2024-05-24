import { type components } from "@/server/lib/agents/college/defs";
import { type FC } from "react";
import DisciplineVariety from "./variety/discipline";
import PracticeKindVariety from "./variety/practice-kind";
import UndefinedVariety from "./variety/undefined";

const Discipline: FC<{
  discipline: components["schemas"]["StudentPerformance"]["discipline"] | null;
}> = ({ discipline }) => {
  if (!discipline) return <UndefinedVariety />;

  const { objectType, objectId } = discipline;

  if (objectType === "discipline")
    return <DisciplineVariety discipline={{ id: objectId }} />;
  if (objectType === "practiceKind")
    return <PracticeKindVariety practiceKind={{ id: objectId }} />;
};

export default Discipline;
