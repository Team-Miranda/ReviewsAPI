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
  // default count to 5 if count param is not specified
  count = count || 5;
  // default page to 1 if page param is not specified
  page = page || 1;

  // determin what is the sorting pattern
  let sortingPattern = "";
  if (!sort || sort === "newest") {
    // sorting pattern is newest
    sortingPattern = "date DESC";
  } else if (sort === "helpful") {
    // sorting pattern helpful
    sortingPattern = "helpfulness DESC";
  } else if (sort === "relevant") {
    // sorting pattern is relevant
    sortingPattern = "date DESC, helpfulness DESC";
  }
  // get query
  return pool.query(
    `SELECT *
    FROM reviews
    WHERE product_id=${product_id}
    AND reported=false
    ORDER BY ${sortingPattern}
    LIMIT ${count};`
  );
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
