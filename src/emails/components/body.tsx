import { cn } from "@/lib/utils";
import { Body as ReactEmailBody } from "@react-email/components";
import type { ComponentProps, FC } from "react";

export const Body: FC<ComponentProps<typeof ReactEmailBody>> = ({
  className,
  ...props
}) => (
  <ReactEmailBody
    className={cn(
      "m-0 h-screen w-screen bg-background text-foreground",
      className,
    )}
    {...props}
  />
);
