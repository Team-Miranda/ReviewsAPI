SET check_function_bodies = false;

DROP TABLE reviews CASCADE;
DROP TABLE photos CASCADE;
DROP TABLE characteristics CASCADE;
DROP TABLE characteristics_reviews CASCADE;

/* Table 'characteristics' */
CREATE TABLE "characteristics"(
  id serial,
  product_id integer NOT NULL,
  "name" varchar(25) NOT NULL,
  PRIMARY KEY(id)
);

/* Table 'characteristics_reviews' */
CREATE TABLE characteristics_reviews(
  id serial,
  characteristics_id integer NOT NULL,
  reviews_id integer NOT NULL,
  "value" integer NOT NULL,
  PRIMARY KEY(id)
);

/* Table 'photos' */
CREATE TABLE photos(
  id serial,
  reviews_id integer NOT NULL,
  url text,
  PRIMARY KEY(id)
);

/* Table 'reviews' */
CREATE TABLE reviews(
  review_id serial,
  product_id integer NOT NULL,
  rating integer NOT NULL,
  date bigint NOT NULL,
  summary varchar NOT NULL,
  body varchar(1000) NOT NULL,
  recommend boolean NOT NULL,
  reported boolean NOT NULL,
  reviewer_name varchar NOT NULL,
  reviewer_email varchar NOT NULL,
  response text,
  helpfulness integer NOT NULL,
  PRIMARY KEY(id)
);


/* Relation 'characteristics_charateristics_reviews' */
ALTER TABLE characteristics_reviews
  ADD CONSTRAINT characteristics_charateristics_reviews
    FOREIGN KEY (characteristics_id) REFERENCES "characteristics" (id);

/* Relation 'reviews_charateristics_reviews' */
ALTER TABLE characteristics_reviews
  ADD CONSTRAINT reviews_charateristics_reviews
    FOREIGN KEY (reviews_id) REFERENCES reviews (id);

/* Relation 'reviews_photos' */
ALTER TABLE photos
  ADD CONSTRAINT reviews_photos FOREIGN KEY (reviews_id) REFERENCES reviews (id)
  ;

COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/kimhonrada/hackreactor/SDC/ReviewsAPI/database/reviews.csv' DELIMITER ',' CSV HEADER;

COPY photos(id, reviews_id, url) FROM '/Users/kimhonrada/hackreactor/SDC/ReviewsAPI/database/reviews_photos.csv' DELIMITER ',' CSV HEADER;

COPY characteristics(id, product_id, name) FROM '/Users/kimhonrada/hackreactor/SDC/ReviewsAPI/database/characteristics.csv' DELIMITER ',' CSV HEADER;

COPY characteristics_reviews(id, characteristics_id, reviews_id, value) FROM '/Users/kimhonrada/hackreactor/SDC/ReviewsAPI/database/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

SELECT setval('reviews_id_seq', max(id)) FROM reviews;

SELECT setval('photos_id_seq', max(id)) FROM photos;

SELECT setval('characteristics_id_seq', max(id)) FROM characteristics;

SELECT setval('characteristics_reviews_id_seq', max(id)) FROM characteristics_reviews;