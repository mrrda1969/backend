const express = require("express");
const Program = require("../models/Program");

/***********************************************
 ****** Routes for program operations **********
 ***********************************************/

const programRoutes = express.Router();

programRoutes.route("/new").post((req, res) => {
  let faculty = new Program({
    name: req.body.name,
    description: req.body.description,
  });
  faculty
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = programRoutes;
