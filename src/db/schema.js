const {
  mysqlTable,
  int,
  varchar,
  datetime,
  boolean,
} = require("drizzle-orm/mysql-core");

const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().notNull().autoincrement(),
  name: varchar("name", { length: 50 }).notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
  description: varchar("description", { length: 300 }),
  username: varchar("username", { length: 25 })
    .notNull()
    .unique("unique_username"),
  password: varchar("password", { length: 255 }).notNull(),
});

const linksTable = mysqlTable("links", {
  id: int("id").primaryKey().notNull().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  visible: boolean("visible").default(false).notNull(),
});

const sessionsTable = mysqlTable("sessions", {
  id: varchar("id", { length: 100 }).primaryKey().notNull().unique(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
});

module.exports = {
  usersTable,
  linksTable,
  sessionsTable,
};
