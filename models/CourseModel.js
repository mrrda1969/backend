const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Course
let CourseModel = new Schema(
  {
    course_name: {
      type: String,
    },
    course_description: {
      type: String,
    },
  },
  {
    collection: "course",
  }
);

module.exports = mongoose.model("CourseModel", CourseModel);
