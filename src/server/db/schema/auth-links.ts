import { relations } from "drizzle-orm";
import { boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import { users } from "./users";

export const authLinks = createTable("auth_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  isUsed: boolean("is_used").notNull().default(false),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const authLinksRelations = relations(authLinks, ({ one }) => ({
  user: one(users, {
    fields: [authLinks.userId],
    references: [users.id],
  }),
}));
