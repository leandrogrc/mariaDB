require("dotenv").config();
const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

exports.db = drizzle({ client: poolConnection });
