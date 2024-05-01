const mongoose = require("mongoose");

let Facilitator = new mongoose.Schema(
  {
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
    staffId: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  {
    collation: { locale: "en" },
  }
);

module.exports = mongoose.model("FacilitatorInfo", Facilitator);
