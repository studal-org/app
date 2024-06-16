import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { type Route } from "next";
import Link from "next/link";
import { type FC, type HTMLAttributes, type ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

const Widget: FC<{
  title: string;
  content: { text: ReactNode; description: ReactNode };
  Icon: LucideIcon;
  href: Route;
}> = ({ title, content, Icon, href }) => {
  const icon = <Icon />;
  return (
    <div className="group relative pt-4">
      <Link href={href} className="peer h-full">
        <Card className="h-full bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.text}</div>
            <p className="text-xs text-muted-foreground">
              {content.description}
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link
        href={href}
        className="absolute right-0 top-0 mr-3 mt-7 rounded-lg border bg-card/40 p-3 transition-all hover:mt-0 peer-hover:mt-0"
      >
        {icon}
      </Link>
    </div>
  );
};

export const WidgetLoading: FC<
  HTMLAttributes<HTMLDivElement> & { widgetLoading: { text?: boolean } }
> = ({ widgetLoading: { text }, className, ...props }) => (
  <div className="pt-4">
    <div
      className={cn(
        "h-full rounded-lg border bg-card/40 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <Skeleton className="whitespace-pre text-sm font-medium leading-none tracking-tight">
          {" ".repeat(15)}
        </Skeleton>
      </div>
      <div className="p-6 pt-0">
        <Skeleton className="whitespace-pre text-2xl font-bold">
          {text && " ".repeat(5)}
        </Skeleton>
        <Skeleton className="whitespace-pre text-xs text-muted-foreground">
          {" ".repeat(20)}
        </Skeleton>
      </div>
    </div>
  </div>
);

export default Widget;
