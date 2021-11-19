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
  photos,
}) => {
  return pool.query(
    `WITH insert AS (
      INSERT INTO
        reviews
        (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES
        (nextval('reviews_id_seq'), ${product_id}, ${rating}, 1615987717622,'${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', '', 0) RETURNING review_id
    )
      INSERT INTO
        photos(id, reviews_id, url)
      VALUES
        (nextval('photos_id_seq'), NULLIF((select review_id from insert), ${photos[0]}'), '${photos[0]}'),
        (nextval('photos_id_seq'), NULLIF((select review_id from insert), ${photos[1]}'), '${photos[1]}'),
        (nextval('photos_id_seq'), NULLIF((select review_id from insert), ${photos[2]}'), '${photos[2]}'),
        (nextval('photos_id_seq'), NULLIF((select review_id from insert), ${photos[3]}'), '${photos[3]}'),
        (nextval('photos_id_seq'), NULLIF((select review_id from insert), ${photos[4]}'), '${photos[4]}');
        `
  );
};

// simple get metadata query
const getMeta = ({ product_id }) => {
  return pool.query(
    `SELECT
      product_id,
      json_build_object('2', 2, '3', 3) AS ratings,
      json_build_object('0', 'not recommended', '1', 'recommended') AS recommended,
      json_agg(json_build_object(name, json_build_object('id', 1, 'value', 2))) AS characteristics
    FROM
      characteristics
    WHERE
      product_id=${product_id}
    GROUP BY
      product_id
    ;`
  );
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

// `WITH insert1 AS (
//   INSERT INTO
//       reviews
//       (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
//       VALUES
//       (nextval('reviews_id_seq'), ${product_id}, ${rating}, 1615987717622,'${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', '', 0) RETURNING review_id;
// ), insert2 AS (
//   INSERT INTO
//     photos(reviews_id, url)
//     VALUES
//     (review_id, ${photos[0]}),
//     (review_id, ${photos[1]}),
//     (review_id, ${photos[2]}),
//     (review_id, ${photos[3]}),
//     (review_id, ${photos[4]});
//     )`;
