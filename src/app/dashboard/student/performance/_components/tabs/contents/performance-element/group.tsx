import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type ComponentProps, type FC } from "react";

export const PerformanceElementGroup: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => <Card className={cn("bg-card/40", className)} {...props} />;

export const PerformanceElementGroupHeader: FC<
  ComponentProps<typeof CardHeader>
> = ({ className, ...props }) => (
  <CardHeader className={cn("pb-4", className)} {...props} />
);

export const PerformanceElementGroupTitle: FC<
  ComponentProps<typeof CardTitle>
> = ({ className, ...props }) => (
  <CardTitle
    className={cn(
      "text-base font-medium uppercase text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export const PerformanceElementGroupContent: FC<
  ComponentProps<typeof CardContent>
> = ({ className, ...props }) => (
  <CardContent className={cn("flex flex-col gap-6", className)} {...props} />
);

export const PerformanceElementGroupLoading: FC = () => (
  <PerformanceElementGroup>
    <PerformanceElementGroupHeader>
      <PerformanceElementGroupTitle>
        <Skeleton className="whitespace-pre">{" ".repeat(50)}</Skeleton>
      </PerformanceElementGroupTitle>
    </PerformanceElementGroupHeader>
    <PerformanceElementGroupContent></PerformanceElementGroupContent>
  </PerformanceElementGroup>
);
