const mongoose = require("mongoose");

const Program = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    collation: {
      locale: "en",
    },
  }
);

module.exports = mongoose.model("ProgramInfo", Program);
