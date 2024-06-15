import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { type FC, type ReactNode } from "react";

const Widget: FC<{
  title: string;
  content: { text: ReactNode; description: ReactNode };
  Icon: LucideIcon;
  href: string;
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

export default Widget;
