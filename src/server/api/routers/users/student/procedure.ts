import { protectedProcedure } from "@/server/api/trpc";
import { students, users } from "@/server/db/schema";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const studentProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const {
      session: {
        user: { id },
      },
      db,
    } = ctx;

    const student = await collegeAgent.GET("/Individual/{id}/Student", {
      params: { path: { id } },
    });

    if (student.error) {
      if (student.error.code === "ReferenceNotFound") {
        await db.update(users).set({ isActive: false }).where(eq(users.id, id));
        await db
          .update(students)
          .set({ isActive: false })
          .where(eq(students.userId, id));
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This User is not associated with an Individual.",
        });
      }

      if (student.error.code === "NotFound") {
        await db
          .update(students)
          .set({ isActive: false })
          .where(eq(students.userId, id));
        throw new TRPCError({
          message: "This User is not Student.",
          code: "NOT_FOUND",
        });
      }

      throw student.error;
    }

    await db
      .update(users)
      .set({ isActive: true })
      .where(and(eq(users.id, id), eq(users.isActive, false)));
    await db
      .insert(students)
      .values({ userId: id })
      .onConflictDoUpdate({
        target: students.userId,
        set: { isActive: true },
        where: eq(students.isActive, false),
      });

    return next({
      ctx: { ...ctx, session: { ...ctx.session, student: student.data } },
    });
  },
);
