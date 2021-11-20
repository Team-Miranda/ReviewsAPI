CREATE INDEX idx_reviews_product
ON reviews(product_id);

CREATE INDEX idx_reviews_id
ON reviews(review_id);

CREATE INDEX idx_characterstics_reviews_id
ON characteristics_reviews(characteristics_id);