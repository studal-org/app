import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type AuthProvider } from "@/server/auth/sso";
import { type ssoAccounts } from "@/server/db/schema";
import { LinkIcon, Tag } from "lucide-react";
import Link from "next/link";
import { type FC, type HTMLAttributes } from "react";
import ProfileSsoProviderAccountActions from "./account-actions";

const ProfileSsoProvider: FC<
  {
    profileSsoPage: {
      provider: AuthProvider;
      account?: typeof ssoAccounts.$inferSelect;
    };
  } & HTMLAttributes<HTMLDivElement>
> = ({
  profileSsoPage: {
    provider: { Icon, title, id },
    account,
  },
  className,
  ...props
}) => (
  <div
    className={cn("flex-col lg:flex-row lg:item-center flex gap-2", className)}
    {...props}
  >
    <div className="flex items-center grow flex-row bg-background/40 p-2.5 rounded-md">
      <div className="flex gap-2 px-3 items-center">
        <Icon className="w-5 h-5" />
        <div className="hidden lg:block">{title}</div>
      </div>
      {account && (
        <div className="flex gap-2 items-center">
          <Avatar className="h-5 w-5">
            <AvatarImage src={account.image} alt={account.title} />
            <AvatarFallback>{account.title.at(0) ?? ""}</AvatarFallback>
          </Avatar>
          <div>{account.title}</div>
          {account.isPrimary && (
            <Badge>
              <Tag className="lg:mr-1 h-3.5 w-3.5" />
              <div className="hidden lg:block">Основной</div>
            </Badge>
          )}
        </div>
      )}
    </div>
    <div className="flex lg:flex-col justify-center gap-2">
      {account ? (
        <ProfileSsoProviderAccountActions
          profileSsoProviderAccountActions={account}
        />
      ) : (
        <Link href={`/dashboard/profile/sso/${id}/redirect`} className="w-full">
          <Button size="sm" className="w-full">
            <LinkIcon className="w-4 h-4 mr-2" /> Связать
          </Button>
        </Link>
      )}
    </div>
  </div>
);

export default ProfileSsoProvider;
