import { cn } from "@/lib/utils";
import { type FC, type HTMLAttributes } from "react";

const NotFound: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-center rounded-lg border bg-background/40 p-5",
      className,
    )}
    {...props}
  >
    <div className="flex flex-col gap-1">
      <div className="text-lg font-semibold">Ничего не найдено 😔</div>
      <div className="text-sm font-medium leading-none">
        Искали везде, но не нашли...
      </div>
    </div>
  </div>
);

export default NotFound;
