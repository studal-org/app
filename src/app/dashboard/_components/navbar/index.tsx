import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ExternalLink, Home, Menu } from "lucide-react";
import { type Route } from "next";
import Link from "next/link";

const links = [{ href: "https://nv-study.ru", text: "Сайт колледжа" }];

const DashboardNavbar: React.FC = () => {
  return (
    <nav className="flex items-center gap-2 text-muted-foreground">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden" size="icon" variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          {links.map(({ href, text }) => (
            <Button key={href} asChild variant="link" size="sm">
              <Link href={href as Route}>
                {text} <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ))}
        </SheetContent>
      </Sheet>
      <Button asChild size="sm">
        <Link href="/dashboard/student">
          <Home className="mr-2 h-4 w-4" />
          Студал
        </Link>
      </Button>
      <div className="hidden items-center gap-2 md:flex">
        {links.map(({ href, text }) => (
          <Button key={href} asChild variant="link" size="sm">
            <Link href={href as Route}>
              {text} <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
