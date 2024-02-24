import { type FC } from "react";

import EmailMethod from "./email";
import OauthMethod from "./oauth";

const AuthForm: FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <EmailMethod />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Или войти через
          </span>
        </div>
      </div>
      <OauthMethod />
    </div>
  );
};

export default AuthForm;
