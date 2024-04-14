import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ExternalLink, Home, Menu } from "lucide-react";
import Link from "next/link";

const StudentNavbar: React.FC = () => {
  return (
    <nav className="flex gap-2 text-muted-foreground items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden" size="icon" variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left"></SheetContent>
      </Sheet>
      <Button asChild size="sm">
        <Link href="/dashboard/student">
          <Home className="h-4 w-4 mr-2" />
          Студал
        </Link>
      </Button>
      <div className="gap-2 hidden md:flex items-center">
        <Button asChild variant="link" size="sm">
          <Link href="https://nv-study.ru">
            Сайт колледжа <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default StudentNavbar;
