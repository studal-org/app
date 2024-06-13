import { relations } from "drizzle-orm";
import { boolean, uuid, varchar } from "drizzle-orm/pg-core";
import { authLinks } from "./auth-links";
import { createTable } from "./create-table";
import { educationalResources } from "./educational-resources";
import { sessions } from "./sessions";

export const users = createTable("users", {
  id: uuid("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  middleName: varchar("middle_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  authLinks: many(authLinks),
  sessions: many(sessions),
  administrator: one(administrators, {
    fields: [users.id],
    references: [administrators.userId],
  }),
}));

export const students = createTable("students", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
});

export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
}));

export const administrators = createTable("administrators", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
});

export const adminsRelations = relations(administrators, ({ one, many }) => ({
  user: one(users, {
    fields: [administrators.userId],
    references: [users.id],
  }),
  educationalResources: many(educationalResources),
}));
