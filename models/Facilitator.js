const mongoose = require("mongoose");

let Facilitator = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  },
  {
    collation: { locale: "en" },
  }
);

module.exports = mongoose.model("FacilitatorInfo", Facilitator);
