const { sql } = require("drizzle-orm");
const {
  mysqlTable,
  int,
  varchar,
  datetime,
  boolean,
  mysqlEnum,
} = require("drizzle-orm/mysql-core");

const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().notNull().autoincrement(),
  name: varchar("name", { length: 50 }).notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
  description: varchar("description", { length: 50 }),
  type: mysqlEnum("type", ["user", "admin"]).default("user"),
  username: varchar("username", { length: 25 })
    .notNull()
    .unique("unique_username"),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

const linksTable = mysqlTable("links", {
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

const sessionsTable = mysqlTable("sessions", {
  id: varchar("id", { length: 100 }).primaryKey().notNull().unique(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
});

const settingsTable = mysqlTable("settings", {
  id: int("id").primaryKey().notNull().autoincrement(),
  key: varchar("key", { length: 50 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
});

module.exports = {
  usersTable,
  linksTable,
  sessionsTable,
  settingsTable,
};
