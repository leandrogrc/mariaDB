require("dotenv").config();

const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Database host
  database: process.env.DB_NAME, // The database you want to use
  user: process.env.DB_USER, // Your MariaDB username
  password: process.env.DB_PASS, // Your MariaDB password
  connectionLimit: 5, // Maximum number of connections
});

module.exports = { pool };
