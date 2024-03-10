import { relations } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from ".";
import { createTable } from "./create-table";

export const sessions = createTable("sessions", {
  jti: uuid("jti").primaryKey().defaultRandom(),
  sub: uuid("sub")
    .notNull()
    .references(() => users.id),
  iat: timestamp("iat").notNull(),
  nbf: timestamp("nbf").notNull(),
  exp: timestamp("exp").notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.sub],
    references: [users.id],
  }),
}));
