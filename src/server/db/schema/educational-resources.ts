import { relations } from "drizzle-orm";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { createTable } from "./create-table";
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
  ({ one }) => ({
    createdBy: one(administrators, {
      fields: [educationalResources.createdBy],
      references: [administrators.userId],
    }),
  }),
);
