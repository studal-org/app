import { cn } from "@/lib/utils";
import { type FC, type HTMLProps } from "react";

const DashboardHeader: FC<HTMLProps<HTMLElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <header className={cn("", className)} {...props}>
      <div className="container flex h-16 items-center justify-between">
        {children}
      </div>
    </header>
  );
};

export default DashboardHeader;
