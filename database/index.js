const { Pool } = require("pg");
const fs = require("fs");
const fastcsv = require("fast-csv");

const pool = new Pool({
  host: "localhost",
  user: "kimhonrada",
  database: "postgres",
  port: 5432,
});

module.exports = {
  pool,
};
