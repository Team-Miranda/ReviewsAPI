const express = require("express");
const path = require("path");
const { pool, getReviews, getMeta } = require("../database/index.js");

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
  getReviews()
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      res.status(404).send(err);
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
