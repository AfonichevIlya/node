const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost", // or your MySQL host
  user: "root",
  password: "stark00711",
  database: "lol",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
