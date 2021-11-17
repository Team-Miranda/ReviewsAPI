const { Pool } = require("pg");

// create new instance of pool
const pool = new Pool({
  host: "localhost",
  user: "kimhonrada",
  database: "postgres",
  port: 5432,
});

// simple get query
const getReviews = () => {
  return pool.query("SELECT * FROM reviews LIMIT 5");
};

const getMeta = () => {
  return pool.query("SELECT * FROM characteristics LIMIT 5");
};

module.exports = {
  pool,
  getReviews,
  getMeta,
};
