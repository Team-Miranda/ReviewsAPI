const express = require("express");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const NodeCache = require("node-cache");
const {
  pool,
  getReviews,
  getMeta,
  addReview,
  helpReview,
  reportReview,
} = require("../database/index.js");

// middle ware
const app = express();
const cache = new NodeCache();

app.use(morgan("tiny"));
app.use(compression());
app.use(express.json());
app.use(express.static("public"));

const port = process.env.port || 3000;

// established database connection
pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to psql");
});

// confirms connection to server
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

// get request for all reviews
// with caching
app.get("/reviews", (req, res) => {
  getReviews(req.query)
    .then((result) => {
      const cachedResponse = cache.get(req.query.product_id);

      if (cachedResponse) {
        let resObj = {
          product: req.query.product_id,
          page: req.query.page || 0,
          count: result.rowCount || 5,
          result: cachedResponse,
        };
        res.send(resObj);
      } else {
        let resObj = {
          product: req.query.product_id,
          page: req.query.page || 0,
          count: result.rowCount || 5,
          result: cachedResponse,
        };
        cache.set(req.query.product_id, result.rows, 120);
        res.send(result.rows);
      }
    })
    .catch((err) => {
      res.status(404).send();
    });
});

// post request to add a review
app.post("/reviews", (req, res) => {
  addReview(req.body)
    .then((result) => {
      res.status(201).send();
    })
    .catch((err) => {
      res.send(err);
    });
});

// get request for all meta data
app.get("/reviews/meta", (req, res) => {
  getMeta(req.query)
    .then((result) => {
      const cachedResponse = cache.get(req.query.product_id);
      if (cachedResponse) {
        res.send(cachedResponse);
      } else {
        cache.set(req.query.product_id, result.rows, 120);
        res.send(result.rows);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
});

// update reviews as helpful
app.put("/reviews/:review_id/helpful", (req, res) => {
  helpReview(req.params)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.send(err);
    });
});

// update reviews as reported
app.put("/reviews/:review_id/report", (req, res) => {
  reportReview(req.params)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.send(err);
    });
});

/*
// get request for all meta data
app.get("/reviews/meta", (req, res) => {
  getMeta(req.query)
    .then((result) => {
      const cachedResponse = cache.get(req.query.product_id);
      if (cachedResponse) {
        res.send(cachedResponse);
      } else {
        cache.set(req.query.product_id, result.rows, 120);
        res.send(result.rows);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
});




// get request for all meta data
app.get("/reviews/meta", (req, res) => {
  getMeta(req.query)
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
 */
