const mongoose = require("mongoose");

let Student = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program"
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("StudentInfo", Student);
