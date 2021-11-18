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
  // default params
  count = count || 5;
  page = page || 1;
  sort = sort || "newest";

  // determin what is the sorting pattern
  let sortingPattern = "";
  if (sort === "newest") {
    sortingPattern = "date DESC";
  } else if (sort === "helpful") {
    sortingPattern = "helpfulness DESC";
  } else if (sort === "relevant") {
    sortingPattern = "date DESC, helpfulness DESC";
  }

  return pool.query(
    `SELECT
    reviews.review_id,
    reviews.product_id,
    reviews.date,
    reviews.summary,
    reviews.body,
    reviews.recommend,
    reviews.reviewer_name,
    reviews.response,
    reviews.helpfulness,
    COALESCE (json_agg(json_build_object('id', photos.id, 'url', photos.url)) FILTER (WHERE photos.reviews_id IS NOT NULL), '[]' )
    AS photos
    FROM reviews
    LEFT JOIN photos ON reviews.review_id = photos.reviews_id
    WHERE reviews.product_id = ${product_id}
    AND reported=false
    GROUP BY reviews.review_id
    ORDER BY ${sortingPattern}
    LIMIT ${count};
    `
  );
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
