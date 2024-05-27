const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Course
let CourseModel = new Schema(
  {
    name: {
      type: String,
    },
    courseCode: {
      type: String,
      unique: [true, "Code already exists"],
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    collection: "course",
  }
);

module.exports = mongoose.model("CourseModel", CourseModel);
