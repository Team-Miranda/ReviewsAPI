const express = require("express");
const path = require("path");
const {
  pool,
  getReviews,
  getMeta,
  addReview,
} = require("../database/index.js");

const app = express();
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
    .then(([result, photos]) => {
      console.log(photos);
      let resObj = {
        product: req.query.product_id,
        page: req.query.page || 0,
        count: result.rowCount || 5,
        result: result.rows,
      };
      res.status(200).send(resObj);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// post request to add a review
app.post("/reviews", (req, res) => {
  // console.log(req.body);
  addReview(req.body)
    .then((result) => {
      console.log(result);
      res.send("success");
    })
    .catch((err) => {
      console.log(err);
      res.send("failed");
    });
});

// get request for all meta data
app.get("/reviews/meta", (req, res) => {
  getMeta()
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// update reviews as helpful
app.put("/reviews/:review_id/helpful", (req, res) => {});

// update reviews as reported
app.put("/reviews/:review_id/report", (req, res) => {});
