const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { courseRoutes, userRoutes } = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

app.use("/courses", courseRoutes);
app.use("/users", userRoutes);

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
