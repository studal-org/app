import { type RouterOutputs } from "@/trpc/shared";
import { type FC } from "react";
import DisciplineVariety from "./variety/discipline";
import PracticeKindVariety from "./variety/practice-kind";
import UndefinedVariety from "./variety/undefined";

const Discipline: FC<{
  discipline:
    | { type: "discipline"; object: RouterOutputs["disciplines"]["read"] }
    | { type: "practiceKind"; object: RouterOutputs["practiceKinds"]["read"] }
    | undefined;
}> = ({ discipline }) => {
  if (discipline?.type === "discipline")
    return <DisciplineVariety {...discipline.object} />;
  if (discipline?.type === "practiceKind")
    return <PracticeKindVariety {...discipline.object} />;

  return <UndefinedVariety />;
};

export default Discipline;
