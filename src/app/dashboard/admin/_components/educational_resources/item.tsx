import Widget, { WidgetLoading } from "@/components/widget";
import { type RouterOutputs } from "@/trpc/shared";
import { Info } from "lucide-react";
import { type Route } from "next";
import { type FC } from "react";

const EducationalResourceUI: FC<{
  educationalResourceUI: RouterOutputs["educationalResources"]["read"];
}> = ({ educationalResourceUI: { title, href, buttonText } }) => {
  return (
    <Widget
      title={title}
      Icon={Info}
      href={href as Route}
      content={{ description: buttonText, text: "" }}
    />
  );
};

export const EducationalResourceUILoading = WidgetLoading;

export default EducationalResourceUI;
