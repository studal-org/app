import ssoAuthProviders from "@/server/auth/sso";
import { api } from "@/trpc/server";
import { type FC } from "react";
import ProfileSsoProvider from "./_components/provider";

const ProfileSsoPage: FC = async () => {
  const ssoAccounts = await api.user.sso.listAccounts();
  return (
    <div>
      <div>
        {ssoAuthProviders.map((provider) => {
          const account = ssoAccounts.find(
            (account) => account.provider === provider.id,
          );
          return (
            <ProfileSsoProvider
              key={provider.id}
              profileSsoPage={{ provider, account }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSsoPage;
