import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ssoAccounts, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const ssoAccountProcedure = protectedProcedure
  .input(z.object({ provider: z.string(), id: z.string() }))
  .use(async ({ ctx, input: { provider, id }, next }) => {
    const {
      db,
      session: {
        user: { id: userId },
      },
    } = ctx;
    const ssoAccount = await db.query.ssoAccounts.findFirst({
      where: (t, { and, eq }) => and(eq(t.provider, provider), eq(t.id, id)),
    });
    if (!ssoAccount)
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    if (ssoAccount.userId !== userId)
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    return next({ ctx: { ...ctx, ssoAccount } });
  });

export const ssoRouter = createTRPCRouter({
  listAccounts: protectedProcedure.query(
    async ({
      ctx: {
        session: {
          user: { id },
        },
        db,
      },
    }) => {
      const ssoAccounts = await db.query.ssoAccounts.findMany({
        where: (t, { eq }) => eq(t.userId, id),
      });
      return ssoAccounts;
    },
  ),
  makePrimary: ssoAccountProcedure.mutation(
    async ({
      ctx: {
        db,
        ssoAccount: { provider, id, isPrimary },
        session: {
          user: { id: userId },
        },
      },
    }) => {
      if (isPrimary === true)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This SsoAccount is already primary",
        });

      const [ssoAccount] = await db
        .update(ssoAccounts)
        .set({ isPrimary: true })
        .where(and(eq(ssoAccounts.provider, provider), eq(ssoAccounts.id, id)))
        .returning();

      if (!ssoAccount)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not make primary",
        });

      await db
        .update(ssoAccounts)
        .set({ isPrimary: false })
        .where(eq(ssoAccounts.userId, userId));

      return ssoAccount;
    },
  ),
  unlink: ssoAccountProcedure.mutation(
    async ({
      ctx: {
        db,
        ssoAccount: { provider, id },
        session: {
          user: { id: userId },
        },
      },
    }) => {
      const [ssoAccount] = await db
        .delete(ssoAccounts)
        .where(and(eq(ssoAccounts.provider, provider), eq(ssoAccounts.id, id)))
        .returning();
      if (!ssoAccount)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not delete",
        });

      const primarySsoAccount = await db.query.ssoAccounts.findFirst({
        where: (t, { eq }) => eq(t.userId, userId),
      });

      await db
        .update(users)
        .set({ image: primarySsoAccount?.image ?? null })
        .where(eq(users.id, userId));

      return ssoAccount;
    },
  ),
});
