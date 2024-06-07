const mongoose = require("mongoose");

const Department = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
});

module.exports = mongoose.model("Department", Department);
