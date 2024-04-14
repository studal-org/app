import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { type FC } from "react";
import Mark from "../../mark";

type MarkT = RouterOutputs["user"]["student"]["performance"]["read"][number];

export type MarksByDisciplineProps = {
  discipline: MarkT["discipline"];
  marks: MarkT[];
};

const MarksByDiscipline: FC<MarksByDisciplineProps> = ({
  discipline,
  marks,
}) => {
  const disciplineComponent =
    discipline?.objectType === "discipline" ? (
      <Discipline
        objectType={discipline.objectType}
        objectId={discipline.objectId}
      />
    ) : discipline?.objectType === "practiceKind" ? (
      "практика"
    ) : (
      "Неопределенная дисциплина"
    );
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg text-secondary-foreground border-b">
        {disciplineComponent}
      </h3>
      <div className="flex flex-col gap-4">
        {marks.map((mark) => (
          <Mark {...mark} />
        ))}
      </div>
    </div>
  );
};

const Discipline: FC<
  NonNullable<MarkT["discipline"] & { objectType: "discipline" }>
> = ({ objectId }) => {
  const { data } = api.disciplines.read.useQuery({ id: objectId });
  if (!data) return "Loading";
  return data.title;
};

export default MarksByDiscipline;
