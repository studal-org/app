import Widget from "@/app/dashboard/student/_components/widget";
import { type RouterOutputs } from "@/trpc/shared";
import { Info } from "lucide-react";
import { type FC } from "react";

const EducationalResourceUI: FC<{
  educationalResourceUI: RouterOutputs["educationalResources"]["read"];
}> = ({ educationalResourceUI: { title, href, buttonText } }) => {
  return (
    <Widget
      title={title}
      Icon={Info}
      href={href}
      content={{ description: buttonText, text: "" }}
    />
  );
};

export default EducationalResourceUI;
