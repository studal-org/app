import { type RouterOutputs } from "@/trpc/shared";
import { type FC } from "react";
import DisciplineBase from "./base";

const DisciplineVariety: FC<RouterOutputs["disciplines"]["read"]> = ({
  id,
  title,
}) => {
  return <DisciplineBase title={title} />;
};

export default DisciplineVariety;
