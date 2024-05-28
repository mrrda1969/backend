const mongoose = require("mongoose");

const Faculty = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      name: {
        type: String,
        required: true,
      },
      facilitators: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "Facilitator",
      },
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "CourseModel",
      },
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("FacultyInfo", Faculty);
