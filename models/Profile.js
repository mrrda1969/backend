const mongoose = require("mongoose");

const StudentProfile = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["female", "male", "other"],
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("StudentProfile", StudentProfile);
