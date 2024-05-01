const mongoose = require("mongoose");

let Student = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastname: {
    type: String,
    required: [true, "Last Name is required"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
});
