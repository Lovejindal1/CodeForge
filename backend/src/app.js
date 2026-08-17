const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

const routes = require("./routes/index");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

module.exports = app;