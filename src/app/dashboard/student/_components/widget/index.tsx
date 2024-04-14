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
    <div className="pt-4 relative group">
      <Link href={href} className="peer h-full">
        <Card className="bg-card/40 h-full">
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
        className="absolute top-0 right-0 peer-hover:mt-0 mt-7 hover:mt-0 transition-all mr-3 bg-card/40 p-3 rounded-lg border"
      >
        {icon}
      </Link>
    </div>
  );
};

export default Widget;
