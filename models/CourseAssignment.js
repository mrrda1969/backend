const mongoose = require("mongoose");

const CourseAssignment = new mongoose.Schema({
  facilitator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facilitator",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

module.exports = mongoose.model("AssignmentInfo", CourseAssignment);
