const { mysqlTable, int, varchar, unique } = require("drizzle-orm/mysql-core");

const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().notNull().autoincrement(),
  username: varchar("username", { length: 100 })
    .notNull()
    .unique("uniqueUsername"),
  password: varchar("password", { length: 255 }).notNull(),
});

const linksTable = mysqlTable("links", {
  id: int("id").primaryKey().notNull().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
});

module.exports = {
  usersTable,
  linksTable,
};
