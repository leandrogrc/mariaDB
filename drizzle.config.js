require("dotenv").config();
const { defineConfig } = require("drizzle-kit");

if (!process.env.DATABASE_URL) {
  throw new Error("Missing `DATABASE_URL` env");
}

module.exports = defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.js",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
