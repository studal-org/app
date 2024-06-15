import { env } from "@/env";
import ssoAuthProviders from "@/server/auth/sso";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export const GET = (
  request: NextRequest,
  { params: { providerId } }: { params: { providerId: string } },
) => {
  const provider = ssoAuthProviders.find(
    (provider) => provider.id === providerId,
  );
  if (!provider) return redirect("/dashboard/profile/sso");

  const { generateRedirectURL } = provider;

  const authorizeURL = generateRedirectURL({
    request,
    callbackUrl: `${env.APP_URL}/dashboard/profile/sso/${providerId}/callback`,
  });

  redirect(authorizeURL);
};
