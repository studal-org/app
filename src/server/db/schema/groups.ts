import { relations } from "drizzle-orm";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import { educationalResourcesGroups } from "./educational-resources";

export const groups = createTable("groups", {
  id: uuid("id").primaryKey(),
  title: varchar("title").notNull(),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  educationalResources: many(educationalResourcesGroups),
}));
