import { Button } from "@/components/ui/button";
import { getSession } from "@/server/auth/session";
import { Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type FC } from "react";
import AuthForm from "./_components/form";

const AuthPage: FC = async () => {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="grid h-screen bg-gradient-to-br from-primary/5 to-primary/20 lg:grid-cols-2">
      <div className="hidden p-10 text-muted-foreground lg:block">
        <nav>
          <ul>
            <li>
              <Button asChild variant="ghost" className="border text-lg">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Студал
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-center justify-center bg-background/40 p-10 shadow-xl">
        <div className="flex w-full max-w-sm flex-col gap-10">
          <h2 className="text-center text-3xl font-bold">Вход</h2>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
