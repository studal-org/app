import { api } from "@/trpc/react";
import { type FC } from "react";
import DisciplineBase from "./base";

const PracticeKindVariety: FC<{ practiceKind: { id: string } }> = ({
  practiceKind: { id },
}) => {
  const [{ title }] = api.practiceKinds.read.useSuspenseQuery({ id });
  return <DisciplineBase title={title} />;
};

export default PracticeKindVariety;
