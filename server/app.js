const express = require("express");
const path = require("path");
const fs = require("fs");
const { pool } = require("../database/index.js");

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
