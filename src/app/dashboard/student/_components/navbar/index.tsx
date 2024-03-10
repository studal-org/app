import { Button } from "@/components/ui/button";
import { ExternalLink, Home } from "lucide-react";
import Link from "next/link";

const StudentNavbar: React.FC = () => {
  return (
    <nav className="flex gap-4 text-muted-foreground">
      <Button asChild size="sm">
        <Link href="/">
          <Home className="h-4 w-4 mr-2" />
          Студал
        </Link>
      </Button>
      <Button asChild variant="link" size="sm">
        <Link href="https://nv-study.ru">
          Сайт колледжа <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </nav>
  );
};

export default StudentNavbar;
