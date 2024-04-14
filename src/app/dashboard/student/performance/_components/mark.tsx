import { type components } from "@/server/lib/agents/college/defs";
import { cva, type VariantProps } from "class-variance-authority";
import { type FC } from "react";

const markVariants = cva(
  "h-12 w-12 flex items-center justify-center font-medium px-2 border rounded-md",
  {
    variants: {
      variant: {
        default: "bg-neutral-100",
        bad: "bg-red-50",
        okay: "bg-yellow-50",
        good: "bg-green-50",
      },
      markVariant: {
        passFail: "",
        mark: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Mark: FC<components["schemas"]["Mark"]> = (mark) => {
  const content = markContent(mark);

  return <div className={markVariants(markToVariant(mark))}>{content}</div>;
};

const markContent = (mark: components["schemas"]["Mark"]) => {
  if ("mark" in mark) return mark.mark;
  return mark.isPassed ? "Зч." : "Нз.";
};

const markToVariant = (
  mark: components["schemas"]["Mark"],
): VariantProps<typeof markVariants> => {
  if ("mark" in mark) {
    if (mark.mark < 3) return { variant: "bad", markVariant: "mark" };
    if (mark.mark === 3) return { variant: "okay", markVariant: "mark" };
    if (mark.mark > 3) return { variant: "good", markVariant: "mark" };
    return { variant: "default", markVariant: "mark" };
  }
  return mark.isPassed
    ? { variant: "good", markVariant: "passFail" }
    : { variant: "bad", markVariant: "passFail" };
};

export default Mark;
