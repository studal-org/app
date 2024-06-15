import { getSession } from "@/server/auth/session";
import ssoAuthProviders from "@/server/auth/sso";
import { db } from "@/server/db";
import { ssoAccounts, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params: { providerId } }: { params: { providerId: string } },
) => {
  const session = await getSession();
  if (!session) redirect("/auth");

  const provider = ssoAuthProviders.find(
    (provider) => provider.id === providerId,
  );
  if (!provider) return redirect("/auth");

  const { id, title, image } = await provider.callback({ request });

  const primarySsoAccount = await db.query.ssoAccounts.findFirst({
    where: (t, { eq }) =>
      and(eq(t.userId, session.user.id), eq(t.isPrimary, true)),
  });

  const data = { title, image };

  const [ssoAccount] = await db
    .insert(ssoAccounts)
    .values({
      id,
      provider: providerId,
      userId: session.user.id,
      isPrimary: !primarySsoAccount ? true : false,
      ...data,
    })
    .onConflictDoUpdate({
      target: [ssoAccounts.id, ssoAccounts.provider],
      set: { ...data, ...(!primarySsoAccount ? { isPrimary: true } : {}) },
    })
    .returning();

  if (!ssoAccount)
    return NextResponse.json("Could not link an account", { status: 400 });

  if (ssoAccount.isPrimary)
    await db
      .update(users)
      .set({ image })
      .where(eq(users.id, ssoAccount.userId));

  redirect("/dashboard/profile/sso");
};
