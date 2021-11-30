const { Pool } = require("pg");
const { urlParser, valParser } = require("./helper/parser.js");

// create new instance of pool
const pool = new Pool({
  host: "localhost", // change this to the public ip
  user: "postgres",
  database: "postgres",
  password: "", // change this:wq
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
      reviews.id,
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
    LEFT JOIN photos ON reviews.id = photos.reviews_id
    WHERE reviews.product_id = ${product_id}
    AND reported=false
    GROUP BY reviews.id
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
  characteristics,
}) => {
  let charKeys = valParser(Object.keys(characteristics));
  let charVals = valParser(Object.values(characteristics));
  photos = urlParser(photos);

  return pool.query(
    `WITH insert AS (
      INSERT INTO
        reviews
        (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES
        (nextval('reviews_id_seq'), ${product_id}, ${rating}, 1615987717622,'${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', '', 0) RETURNING id, product_id
    ), insert2 AS (
      INSERT INTO
        characteristics_reviews
        (id, characteristics_id, reviews_id, value)
      VALUES
        (nextval('characteristics_reviews_id_seq'), unnest(array${charKeys})::integer, (select id from insert), unnest(array${charVals})::integer)
    )
     INSERT INTO
       photos(id, reviews_id, url)
     VALUES
       (nextval('photos_id_seq'), (select id from insert), unnest(array${photos}))
        `
  );
};

// simple get metadata query
const getMeta = ({ product_id }) => {
  return pool.query(
    `SELECT
    product_id,
    json_build_object(
      '1', (select count(reviews.rating) from reviews where rating=1 and product_id=${product_id}),
      '2', (select count(reviews.rating) from reviews where rating=2 and product_id=${product_id}),
      '3', (select count(reviews.rating) from reviews where rating=3 and product_id=${product_id}),
      '4', (select count(reviews.rating) from reviews where rating=4 and product_id=${product_id}),
      '5', (select count(reviews.rating) from reviews where rating=5 and product_id=${product_id}))
    AS ratings,
    json_build_object(
      '0', (select count(reviews.recommend) from reviews where reviews.recommend=false and product_id=${product_id}),
      '1', (select count(reviews.recommend) from reviews where reviews.recommend=true and product_id=${product_id}))
    AS recommended,
    json_object_agg(c.name, json_build_object(
      'id', c.id,
      'value', (select avg("value") from characteristics_reviews where characteristics_id=c.id)
      )) AS characteristics
    FROM
    characteristics c
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

/**

// simple get metadata query
const getMeta = ({ product_id }) => {
  return pool.query(
    `SELECT
    product_id,
    json_build_object(
      '1', (select count(reviews.rating) from reviews where rating=1 and product_id=${product_id}),
      '2', (select count(reviews.rating) from reviews where rating=2 and product_id=${product_id}),
      '3', (select count(reviews.rating) from reviews where rating=3 and product_id=${product_id}),
      '4', (select count(reviews.rating) from reviews where rating=4 and product_id=${product_id}),
      '5', (select count(reviews.rating) from reviews where rating=5 and product_id=${product_id}))
    AS ratings,
    json_build_object(
      '0', (select count(reviews.recommend) from reviews where reviews.recommend=false and product_id=${product_id}),
      '1', (select count(reviews.recommend) from reviews where reviews.recommend=true and product_id=${product_id}))
    AS recommended,
    json_object_agg(c.name, json_build_object(
      'id', c.id,
      'value', (select avg("value") from characteristics_reviews where characteristics_id=c.id)
      )) AS characteristics
    FROM
    characteristics c
    WHERE
    product_id=${product_id}
  GROUP BY
    product_id
  ;`
  );
};





 */
