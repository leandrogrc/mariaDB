import { sql, InferSelectModel } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  datetime,
  boolean,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().notNull().autoincrement(),
  name: varchar("name", { length: 50 }).notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
  description: varchar("description", { length: 50 }),
  type: mysqlEnum("type", ["user", "admin"]).notNull().default("user"),
  username: varchar("username", { length: 25 })
    .notNull()
    .unique("unique_username"),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type User = InferSelectModel<typeof usersTable>;

export const linksTable = mysqlTable("links", {
  id: int("id").primaryKey().notNull().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  active: boolean("active").default(false).notNull(),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Link = InferSelectModel<typeof linksTable>;

export const sessionsTable = mysqlTable("sessions", {
  id: varchar("id", { length: 100 }).primaryKey().notNull().unique(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
});

export const settingsTable = mysqlTable("settings", {
  id: int("id").primaryKey().notNull().autoincrement(),
  key: varchar("key", { length: 50 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
});

export const logsTable = mysqlTable("logs", {
  id: int("id").primaryKey().notNull().autoincrement(),
  userId: int("user_id").references(() => usersTable.id),
  type: mysqlEnum("type", ["log", "error"]).notNull().default("log"),
  title: varchar("title", { length: 500 }).notNull(),
  details: text("details"),
  stack: text("stack"),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
