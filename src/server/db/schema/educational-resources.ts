import { relations } from "drizzle-orm";
import { primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { createTable } from "./create-table";
import { groups } from "./groups";
import { administrators } from "./users";

export const educationalResources = createTable("educational_resources", {
  id: varchar("id").primaryKey().$defaultFn(ulid),
  title: varchar("title").notNull(),
  buttonText: varchar("button_text").notNull(),
  href: varchar("href").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => administrators.userId),
});

export const educationalResourcesRelations = relations(
  educationalResources,
  ({ one, many }) => ({
    createdBy: one(administrators, {
      fields: [educationalResources.createdBy],
      references: [administrators.userId],
    }),
    group: many(educationalResourcesGroups),
  }),
);

export const educationalResourcesGroups = createTable(
  "educational_resources_groups",
  {
    educationalResourceId: varchar("educational_resource_id")
      .notNull()
      .references(() => educationalResources.id),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.educationalResourceId, t.groupId] }),
  }),
);

export const educationalResourcesGroupsRelations = relations(
  educationalResourcesGroups,
  ({ one }) => ({
    educationalResource: one(educationalResources, {
      fields: [educationalResourcesGroups.educationalResourceId],
      references: [educationalResources.id],
    }),
    group: one(groups, {
      fields: [educationalResourcesGroups.groupId],
      references: [groups.id],
    }),
  }),
);
