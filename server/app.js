const express = require("express");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const {
  pool,
  getReviews,
  getMeta,
  addReview,
  helpReview,
  reportReview,
} = require("../database/index.js");
const { sortNew } = require("./sorter.js");

// middle ware
const app = express();
app.use(morgan("tiny"));
app.use(compression());
app.use(express.json());

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
app.get("/reviews", (req, res) => {
  //console.log("this is the req ", req.query);
  getReviews(req.query)
    .then((result) => {
      let resObj = {
        product: req.query.product_id,
        page: req.query.page || 0,
        count: result.rowCount || 5,
        result: sortNew(result.rows),
      };
      res.status(200).send(resObj);
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
      console.log(err);
      res.send(err);
    });
});

// get request for all meta data
app.get("/reviews/meta", (req, res) => {
  getMeta(req.query)
    .then((result) => {
      res.status(200).send(result.rows);
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
