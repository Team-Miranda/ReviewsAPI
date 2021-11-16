SET check_function_bodies = false;

/* Table 'reviews' */
CREATE TABLE reviews(
  id integer NOT NULL,
  product_id integer NOT NULL,
  rating integer NOT NULL,
  date date NOT NULL,
  summary varchar NOT NULL,
  body varchar NOT NULL,
  recommend boolean NOT NULL,
  reported boolean NOT NULL,
  reviewer_name varchar NOT NULL,
  reviewer_email varchar NOT NULL,
  response text,
  helpfulness integer NOT NULL,
  PRIMARY KEY(id)
);

/* Table 'photos' */
CREATE TABLE photos(
  id integer NOT NULL,
  reviews_id integer NOT NULL,
  url text[],
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

/* Table 'characteristics' */
CREATE TABLE "characteristics"(
  id integer NOT NULL,
  "name" varchar NOT NULL,
  product_id integer NOT NULL,
  PRIMARY KEY(id)
);

/* Relation 'reviews_photos' */
ALTER TABLE photos
  ADD CONSTRAINT reviews_photos FOREIGN KEY (reviews_id) REFERENCES reviews (id)
  ;

/* Relation 'reviews_charateristics_reviews' */
ALTER TABLE characteristics_reviews
  ADD CONSTRAINT reviews_charateristics_reviews
    FOREIGN KEY (reviews_id) REFERENCES reviews (id);

/* Relation 'characteristics_charateristics_reviews' */
ALTER TABLE characteristics_reviews
  ADD CONSTRAINT characteristics_charateristics_reviews
    FOREIGN KEY (characteristics_id) REFERENCES "characteristics" (id);
