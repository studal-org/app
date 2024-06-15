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
  if (!provider) return redirect("/auth");

  const { generateRedirectURL } = provider;

  const authorizeURL = generateRedirectURL({ request });

  redirect(authorizeURL);
};
