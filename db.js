const Pool = require("pg").Pool;
const dotenv = require("dotenv").config();

const pool = new Pool({
  user: process.env.user,
  host:process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: 5432,
});

module.exports = pool;
