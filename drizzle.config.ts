import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing `DATABASE_URL` env");
}

export default defineConfig({
  out: "./src/server/db/migrations",
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
