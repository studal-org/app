import { type components } from "@/server/lib/agents/college/defs";
import { type FC } from "react";

const IndividualNameUI: FC<
  Pick<components["schemas"]["Individual"], "fullName" | "name">
> = ({ fullName, name }) => {
  if (name) return <IndividualAbbreviatedNameUI name={name} />;
  if (fullName) return fullName;
};

export const IndividualAbbreviatedNameUI: FC<{
  name: NonNullable<components["schemas"]["Individual"]["name"]>;
}> = ({ name }) => {
  const { first, middle, last } = name;
  return `${last} ${first.at(0)}. ${middle.at(0)}.`;
};

export default IndividualNameUI;
