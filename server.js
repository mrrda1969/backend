const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const authRoutes = require("./controllers/auth");
const courseRoutes = require("./controllers/api");
const studentRoutes = require("./controllers/api");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

app.use("/courses", courseRoutes);
app.use("/students", studentRoutes);
app.use("/users", authRoutes);
app.use("/storage", express.static("storage"));
app.use(logger("dev"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});

module.exports = app;
