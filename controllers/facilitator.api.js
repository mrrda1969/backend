const express = require("express");
const Facilitator = require("../models/Facilitator");

const facilitatorRoutes = express.Router();

facilitatorRoutes.route("/new").post((req, res) => {
  const { staffId, department, faculty } = req.body;
  let facilitator = new Facilitator({
    staffId,
    department,
    faculty,
  });
  facilitator
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = facilitatorRoutes;
