const mongoose = require("mongoose");

let Student = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    firstname: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Date of Birth is required"],
    },
    studentId: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("StudentInfo", Student);
