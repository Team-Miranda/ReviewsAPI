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
  characteristics,
}) => {
  let charKeys = Object.keys(characteristics);
  let charVals = Object.values(characteristics);
  photos =
    "[" +
    photos.map((each) => {
      return `'${each}'`;
    }) +
    "]";

  charKeys =
    "[" +
    charKeys.map((each) => {
      return `'${parseInt(each)}'`;
    }) +
    "]";

  charVals =
    "[" +
    charVals.map((each) => {
      return `'${parseInt(each)}'`;
    }) +
    "]";

  return pool.query(
    `WITH insert AS (
      INSERT INTO
        reviews
        (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES
        (nextval('reviews_id_seq'), ${product_id}, ${rating}, 1615987717622,'${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', '', 0) RETURNING review_id, product_id
    ), insert2 AS (
      INSERT INTO
        characteristics_reviews
        (id, characteristics_id, reviews_id, value)
      VALUES
        (nextval('characteristics_reviews_id_seq'), unnest(array${charKeys})::integer, (select review_id from insert), unnest(array${charVals})::integer)
    )
     INSERT INTO
       photos(id, reviews_id, url)
     VALUES
       (nextval('photos_id_seq'), (select review_id from insert), unnest(array${photos}))
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
      json_agg(json_build_object(c.name, json_build_object(
        'id', c.id,
        'value', (select AVG(cr.value::real )from characteristics_reviews cr where c.id=cr.id)
        )))
      AS characteristics
      FROM
      characteristics c
      LEFT JOIN characteristics_reviews cr ON c.id=cr.id
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

/*
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

, insertchar AS (
      INSERT INTO
        characteristics_reviews
        (id, characteristics_id, reviews_id, value)
      VALUES
        (nextval('characteristics_reviews_id_seq'), nextval('characteristics_id_seq'), (select review_id from insert), ${charVals[0]}),
        (nextval('characteristics_reviews_id_seq'), nextval('characteristics_id_seq'), (select review_id from insert), ${charVals[1]}),
        (nextval('characteristics_reviews_id_seq'), nextval('characteristics_id_seq'), (select review_id from insert), ${charVals[2]}),
        (nextval('characteristics_reviews_id_seq'), nextval('characteristics_id_seq'), (select review_id from insert), ${charVals[3]}),
        (nextval('characteristics_reviews_id_seq'), nextval('characteristics_id_seq'), (select review_id from insert), ${charVals[4]}),
        (nextval('characteristics_reviews_id_seq'), nextval('characteristics_id_seq'), (select review_id from insert), ${charVals[5]})
    )
*/
