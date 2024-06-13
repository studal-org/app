import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { educationalResources } from "@/server/db/schema/educational-resources";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { isValid } from "ulidx";
import { z } from "zod";
import { administratorProcedure } from "../users/admins/procedure";

const educationalResourceProcedure = publicProcedure
  .input(z.object({ id: z.string().refine(isValid) }))
  .use(async ({ ctx, input: { id }, next }) => {
    const { db } = ctx;
    const educationalResource = await db.query.educationalResources.findFirst({
      where: (t, { eq }) => eq(t.id, id),
    });
    if (!educationalResource)
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    return next({ ctx: { ...ctx, educationalResource } });
  });

export const educationalResourcesRouter = createTRPCRouter({
  read: educationalResourceProcedure
    .unstable_concat(protectedProcedure)
    .query(({ ctx: { educationalResource } }) => {
      return educationalResource;
    }),
  list: protectedProcedure.query(async ({ ctx: { db } }) => {
    return await db.select().from(educationalResources);
  }),
  upsert: administratorProcedure
    .input(
      createInsertSchema(educationalResources).pick({
        id: true,
        title: true,
        buttonText: true,
        href: true,
      }),
    )
    .mutation(async ({ input: { id, ...input }, ctx: { db, session } }) => {
      const values = { ...input, createdBy: session.user.id };
      const [educationalResource] = await db
        .insert(educationalResources)
        .values({ id, ...values })
        .onConflictDoUpdate({ target: educationalResources.id, set: values })
        .returning();
      if (!educationalResource)
        throw new TRPCError({
          message: "Could not upsert educational resource",
          code: "INTERNAL_SERVER_ERROR",
        });
      return educationalResource;
    }),
  delete: educationalResourceProcedure
    .unstable_concat(administratorProcedure)
    .mutation(
      async ({
        ctx: {
          db,
          educationalResource: { id },
        },
      }) => {
        const [educationalResource] = await db
          .delete(educationalResources)
          .where(eq(educationalResources.id, id))
          .returning();
        if (!educationalResource)
          throw new TRPCError({
            message: "Could not upsert educational resource",
            code: "INTERNAL_SERVER_ERROR",
          });
        return educationalResource;
      },
    ),
});
