import { authenticate } from "@/server/auth/authenticate";
import ssoAuthProviders from "@/server/auth/sso";
import { db } from "@/server/db";
import { ssoAccounts, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params: { providerId } }: { params: { providerId: string } },
) => {
  const provider = ssoAuthProviders.find(
    (provider) => provider.id === providerId,
  );
  if (!provider) return redirect("/auth");

  const { id, title, image } = await provider.callback({ request });

  const ssoAccount = await db.query.ssoAccounts.findFirst({
    where: (t, { eq, and }) => and(eq(t.provider, providerId), eq(t.id, id)),
  });
  if (!ssoAccount) redirect("/auth");

  const primarySsoAccount = await db.query.ssoAccounts.findFirst({
    where: (t, { eq }) =>
      and(eq(t.userId, ssoAccount.userId), eq(t.isPrimary, true)),
  });

  const updateData = {
    title,
    image,
    ...(!primarySsoAccount ? { isPrimary: true } : {}),
  };

  await db
    .update(ssoAccounts)
    .set(updateData)
    .where(and(eq(ssoAccounts.provider, providerId), eq(ssoAccounts.id, id)));

  if (ssoAccount.isPrimary || !primarySsoAccount)
    await db
      .update(users)
      .set({ image })
      .where(eq(users.id, ssoAccount.userId));

  await authenticate(ssoAccount.userId);

  redirect("/dashboard");
};
