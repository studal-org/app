import { type FC } from "react";

import { Separator } from "@/components/ui/separator";
import EmailMethod from "./email";
import OauthMethod from "./oauth";

const AuthForm: FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <EmailMethod />
      <div className="flex items-center gap-x-2">
        <div className="grow">
          <Separator />
        </div>
        <span className="text-muted-foreground text-xs uppercase">
          Или войти через
        </span>
        <div className="grow">
          <Separator />
        </div>
      </div>
      <OauthMethod />
    </div>
  );
};

export default AuthForm;
