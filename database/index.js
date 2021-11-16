const { Pool } = require("pg");
const fs = require("fs");
const fastcsv = require("fast-csv");

// create new instance of pool
const pool = new Pool({
  host: "localhost",
  user: "kimhonrada",
  database: "postgres",
  port: 5432,
});

module.exports = {
  pool,
};
