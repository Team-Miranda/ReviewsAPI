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
  // default sort to newest is sort param is not specified
  sort = sort || "newest";

  // determin what is the sorting pattern
  let sortingPattern = "";
  if (sort === "newest") {
    // sorting pattern is newest
    sortingPattern = "date DESC";
  } else if (sort === "helpful") {
    // sorting pattern helpful
    sortingPattern = "helpfulness DESC";
  } else if (sort === "relevant") {
    // sorting pattern is relevant
    sortingPattern = "date DESC, helpfulness DESC";
  }

  const reviewQueryString = `SELECT * FROM reviews WHERE product_id=${product_id} AND reported=false ORDER BY ${sortingPattern} LIMIT ${count};`;

  // const reviewQueryString = `SELECT * FROM reviews LEFT JOIN photos ON reviews.id = photos.reviews_id WHERE product_id=${product_id} AND reported=false ORDER BY ${sortingPattern} LIMIT ${count};`;

  const photoQueryString = `SELECT * FROM photos INNER JOIN reviews ON photos.reviews_id = reviews.id WHERE product_id=${product_id}`;

  const queryPromises = [];
  queryPromises.push(pool.query(reviewQueryString));
  return Promise.all(queryPromises);
};

const addReview = ({
  product_id,
  rating,
  date,
  summary,
  body,
  recommend,
  reviewer_name,
  reviewer_email,
}) => {
  return pool.query(
    `INSERT INTO
    reviews(
      review_id,
      product_id,
      rating,
      date,
      summary,
      body,
      recommend,
      reported,
      reviewer_name,
      reviewer_email,
      response,
      helpfulness)
      VALUES
      (nextval('reviews_id_seq'),
      ${product_id},
      ${rating},
      1615987717622,
      '${summary}',
      '${body}',
      ${recommend},
      false,
      '${reviewer_name}',
      '${reviewer_email}',
      '',
      0)`
  );
};

// simple get metadata query
const getMeta = () => {
  return pool.query("SELECT * FROM characteristics LIMIT 5");
};

// update helpfulness per review_id
const helpReview = ({ review_id }) => {
  return pool.query(
    `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id=${review_id};`
  );
};

// update report per review_id
const reportReview = ({ review_id }) => {
  return pool.query(
    `UPDATE reviews SET reported = true WHERE review_id=${review_id};`
  );
};

module.exports = {
  pool,
  getReviews,
  getMeta,
  addReview,
  helpReview,
  reportReview,
};
