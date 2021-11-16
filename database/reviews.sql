SET check_function_bodies = false;

/* Table 'characteristics' */
CREATE TABLE "characteristics"(
  id integer NOT NULL,
  product_id integer NOT NULL,
  "name" varchar(25) NOT NULL,
  PRIMARY KEY(id)
);

/* Table 'characteristics_reviews' */
CREATE TABLE characteristics_reviews(
  id integer NOT NULL,
  characteristics_id integer NOT NULL,
  reviews_id integer NOT NULL,
  "value" integer NOT NULL,
  PRIMARY KEY(id)
);

/* Table 'photos' */
CREATE TABLE photos(
  id integer NOT NULL,
  reviews_id integer NOT NULL,
  url text,
  PRIMARY KEY(id)
);

/* Table 'reviews' */
CREATE TABLE reviews(
  id integer NOT NULL,
  product_id integer(20) NOT NULL,
  rating integer(20) NOT NULL,
  date bigint NOT NULL,
  summary varchar(60) NOT NULL,
  body varchar(1000) NOT NULL,
  recommend boolean NOT NULL,
  reported boolean NOT NULL,
  reviewer_name varchar(30) NOT NULL,
  reviewer_email varchar(30) NOT NULL,
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
