import { type RouterOutputs } from "@/trpc/shared";
import { type FC } from "react";
import DisciplineBase from "../variety/base";

const KindDiscipline: FC<RouterOutputs["disciplines"]["read"]> = ({
  title,
}) => {
  return <DisciplineBase title={title} />;
};

export default KindDiscipline;
