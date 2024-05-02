const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./controllers/auth");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

// app.use("/courses", courseRoutes);
app.use("/users", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error");
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});

module.exports = app;
