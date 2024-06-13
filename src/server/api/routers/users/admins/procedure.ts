import { protectedProcedure } from "@/server/api/trpc";
import { administrators, users } from "@/server/db/schema";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const administratorProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const {
      session: {
        user: { id },
      },
      db,
    } = ctx;

    const administrator = await collegeAgent.GET(
      "/Individual/{id}/Administrator",
      { params: { path: { id } } },
    );

    if (administrator.error) {
      if (administrator.error.code === "ReferenceNotFound") {
        await db.update(users).set({ isActive: false }).where(eq(users.id, id));
        await db
          .update(administrators)
          .set({ isActive: false })
          .where(eq(administrators.userId, id));
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This User is not associated with an Individual.",
        });
      }

      if (administrator.error.code === "NotFound") {
        await db
          .update(administrators)
          .set({ isActive: false })
          .where(eq(administrators.userId, id));
        throw new TRPCError({
          message: "This User is not Administrator.",
          code: "NOT_FOUND",
        });
      }

      throw administrator.error;
    }

    await db
      .update(users)
      .set({ isActive: true })
      .where(and(eq(users.id, id), eq(users.isActive, false)));
    await db
      .insert(administrators)
      .values({ userId: id })
      .onConflictDoUpdate({
        target: administrators.userId,
        set: { isActive: true },
        where: eq(administrators.isActive, false),
      });

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, administrator: administrator.data },
      },
    });
  },
);
