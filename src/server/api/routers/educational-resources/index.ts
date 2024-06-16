import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  educationalResources,
  educationalResourcesGroups,
  groups,
} from "@/server/db/schema";
import { collegeAgent } from "@/server/lib/agents/college";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { isValid } from "ulidx";
import { z } from "zod";
import { administratorProcedure } from "../users/admins/procedure";
import { studentProcedure } from "../users/student/procedure";

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
    .unstable_concat(administratorProcedure)
    .query(({ ctx: { educationalResource } }) => {
      return educationalResource;
    }),
  list: administratorProcedure.query(async ({ ctx: { db } }) => {
    const educationalResourcesList = await db
      .select()
      .from(educationalResources)
      .leftJoin(
        educationalResourcesGroups,
        eq(
          educationalResources.id,
          educationalResourcesGroups.educationalResourceId,
        ),
      )
      .leftJoin(groups, eq(educationalResourcesGroups.groupId, groups.id))
      .orderBy(
        sql`${groups.title} asc nulls first`,
        educationalResources.title,
      );
    return educationalResourcesList;
  }),
  listByStudentGroup: studentProcedure.query(
    async ({
      ctx: {
        db,
        session: {
          student: { groupId },
        },
      },
    }) => {
      const educationalResourcesList = await db
        .select()
        .from(educationalResources)
        .leftJoin(
          educationalResourcesGroups,
          eq(
            educationalResources.id,
            educationalResourcesGroups.educationalResourceId,
          ),
        )
        .where(
          or(
            groupId
              ? eq(educationalResourcesGroups.groupId, groupId)
              : undefined,
            isNull(educationalResourcesGroups.groupId),
          ),
        )
        .orderBy(
          isNull(educationalResourcesGroups.groupId),
          educationalResources.title,
        );
      return educationalResourcesList;
    },
  ),
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
  listGroups: educationalResourceProcedure
    .unstable_concat(administratorProcedure)
    .query(
      async ({
        ctx: {
          db,
          educationalResource: { id },
        },
      }) => {
        return await db.query.educationalResourcesGroups.findMany({
          where: (t, { eq }) => eq(t.educationalResourceId, id),
          with: { group: true },
        });
      },
    ),
  addGroup: educationalResourceProcedure
    .unstable_concat(administratorProcedure)
    .input(z.object({ groupId: z.string().uuid() }))
    .mutation(
      async ({
        ctx: {
          db,
          educationalResource: { id },
        },
        input: { groupId },
      }) => {
        const educationalResourceGroupExists =
          await db.query.educationalResourcesGroups.findFirst({
            where: (t, { eq, and }) =>
              and(eq(t.educationalResourceId, id), eq(t.groupId, groupId)),
          });
        if (educationalResourceGroupExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This group is already added to educationalResource",
          });

        const group = await collegeAgent.GET("/Groups/{id}", {
          params: { path: { id: groupId } },
        });
        if (group.error) {
          if (
            group.error.code === "ReferenceNotFound" &&
            group.error.referenceType === "group"
          )
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Group with provided ID was not found.",
            });
          throw new TRPCError({
            message: "Something went wrong.",
            code: "INTERNAL_SERVER_ERROR",
            cause: group.error,
          });
        }
        const { id: _, ...groupData } = group.data;
        const [groupDb] = await db
          .insert(groups)
          .values({ id: groupId, ...groupData })
          .onConflictDoUpdate({ target: groups.id, set: groupData })
          .returning();
        if (!groupDb)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not create Group",
          });

        const [educationalResourceGroup] = await db
          .insert(educationalResourcesGroups)
          .values({ educationalResourceId: id, groupId })
          .onConflictDoNothing()
          .returning();

        if (!educationalResourceGroup)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not add group to educationalResource",
          });

        return educationalResourceGroup;
      },
    ),
  removeGroup: educationalResourceProcedure
    .unstable_concat(administratorProcedure)
    .input(z.object({ groupId: z.string().uuid() }))
    .mutation(
      async ({
        ctx: {
          db,
          educationalResource: { id },
        },
        input: { groupId },
      }) => {
        const educationalResourceGroupExists =
          await db.query.educationalResourcesGroups.findFirst({
            where: (t, { eq, and }) =>
              and(eq(t.educationalResourceId, id), eq(t.groupId, groupId)),
          });
        if (!educationalResourceGroupExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This group is not related to educationalResource",
          });

        const [educationalResourceGroup] = await db
          .delete(educationalResourcesGroups)
          .where(
            and(
              eq(educationalResourcesGroups.educationalResourceId, id),
              eq(educationalResourcesGroups.groupId, groupId),
            ),
          )
          .returning();

        if (!educationalResourceGroup)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not remove group from educationalResource",
          });

        return educationalResourceGroup;
      },
    ),
});
