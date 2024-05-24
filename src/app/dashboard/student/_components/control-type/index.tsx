import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Shapes } from "lucide-react";
import { type ComponentProps, type FC } from "react";

const ControlType: FC<
  ComponentProps<typeof Badge> & { controlType: { id: string } }
> = ({ controlType: { id } }) => {
  const [{ title }] = api.controlTypes.read.useSuspenseQuery({ id });
  return (
    <Badge variant="outline" className="bg-neutral-50">
      <Shapes className="mr-1 h-3.5 w-3.5" />
      {title}
    </Badge>
  );
};

export default ControlType;
