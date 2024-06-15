import { type FC } from "react";

import { Separator } from "@/components/ui/separator";
import EmailMethod from "./email";
import SsoMethod from "./sso";

const AuthForm: FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <EmailMethod />
      <div className="flex items-center gap-x-2">
        <div className="grow">
          <Separator />
        </div>
        <span className="text-xs uppercase text-muted-foreground">
          Или войти через
        </span>
        <div className="grow">
          <Separator />
        </div>
      </div>
      <SsoMethod />
    </div>
  );
};

export default AuthForm;
