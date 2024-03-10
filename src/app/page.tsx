import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-br from-primary/5 to-primary/20 justify-center gap-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Студал
        </h1>
        <div className="text-lg font-semibold">
          Нижневартовский социально-гуманитарный колледж
        </div>
      </div>
      <Link href="/dashboard">
        <Button>
          <LogIn className="mr-2 w-4 h-4" /> Перейти
        </Button>
      </Link>
    </main>
  );
}
