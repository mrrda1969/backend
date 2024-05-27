const mongoose = require("mongoose");

let Facilitator = new mongoose.Schema(
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
    staffId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      ref: "UserModel",
    },
    department: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "CourseModel",
      },
    ],
  },
  {
    collation: { locale: "en" },
  }
);

module.exports = mongoose.model("FacilitatorInfo", Facilitator);
