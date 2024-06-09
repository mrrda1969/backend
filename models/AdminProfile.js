const mongoose = require("mongoose");

let Admin = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    collation: { locale: "en" },
  }
);
module.exports = mongoose.model("AdminInfo", Admin);
