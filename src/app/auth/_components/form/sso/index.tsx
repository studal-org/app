import { Button } from "@/components/ui/button";
import ssoAuthProviders, { generateRedirectURL } from "@/server/auth/sso";
import Link from "next/link";
import { type FC } from "react";

const SsoMethod: FC = () => {
  return (
    <div className="flex flex-col gap-2">
      {ssoAuthProviders.map(({ id, Icon, title }) => (
        <Link key={id} href={generateRedirectURL(id)}>
          <Button variant="outline" className="w-full">
            <Icon className="mr-2 h-4 w-4" /> {title}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default SsoMethod;
