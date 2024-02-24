import { relations } from "drizzle-orm";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { authLinks } from "./auth-links";
import { createTable } from "./create-table";

export const users = createTable("users", {
  id: uuid("id").primaryKey(),
  fullName: varchar("full_name"),
  email: varchar("email").notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  authLinks: many(authLinks),
}));
