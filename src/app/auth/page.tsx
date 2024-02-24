import { type FC } from "react";
import AuthForm from "./_components/form";

const AuthPage: FC = () => {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="bg-muted text-muted-foreground hidden p-10 lg:block">
        <nav>
          <ul>
            <li>
              <a
                className="hover:text-foreground text-lg font-medium transition-colors"
                href="/"
              >
                Студал
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-center justify-center p-10">
        <div className="flex w-full max-w-sm flex-col gap-10">
          <h2 className="text-center text-3xl font-bold">Вход</h2>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
