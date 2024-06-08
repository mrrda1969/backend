const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Course
let CourseModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      unique: [true, "Code already exists"],
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    collection: "course",
  }
);

module.exports = mongoose.model("CourseModel", CourseModel);
