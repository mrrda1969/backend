const express = require("express");
const app = express();
const router = require("./routes/routes");
const mongoose = require("mongoose");
const middleware = require("./middleware/middleware");

require("dotenv").config();

app.use(middleware);
app.use(router);

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
