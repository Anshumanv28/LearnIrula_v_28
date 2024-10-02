const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./api/routes/main");

const app = express();

app.use(morgan("dev"));
mongoose
  .set("strictQuery", false)
  .connect(
    "mongodb+srv://ariz:JQ8cdql995Vw0Fuu@learnirula-test.u9q36rx.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((err) => {
    console.log(err);
  });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});
app.use("/api", router);

module.exports = app;
