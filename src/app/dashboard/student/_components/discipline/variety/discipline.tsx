import { api } from "@/trpc/react";
import { type FC } from "react";
import DisciplineBase from "./base";

const DisciplineVariety: FC<{ discipline: { id: string } }> = ({
  discipline: { id },
}) => {
  const [{ title }] = api.disciplines.read.useSuspenseQuery({ id });
  return <DisciplineBase title={title} />;
};

export default DisciplineVariety;
