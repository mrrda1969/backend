const mongoose = require("mongoose");

let ListedStudent = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("ListedStudInfo", ListedStudent);
