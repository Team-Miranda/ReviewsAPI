const { Pool } = require("pg");

// create new instance of pool
const pool = new Pool({
  host: "localhost",
  user: "kimhonrada",
  database: "postgres",
  port: 5432,
});

// simple get reviews query
const getReviews = ({ page, count, sort, product_id }) => {
  return pool.query("SELECT * FROM reviews LIMIT 5");
};

// simple get metadata query
const getMeta = () => {
  return pool.query("SELECT * FROM characteristics LIMIT 5");
};

module.exports = {
  pool,
  getReviews,
  getMeta,
};
