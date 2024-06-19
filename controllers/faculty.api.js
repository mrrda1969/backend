const express = require("express");
const Faculty = require("../models/Faculty");

/***********************************************
 ****** Routes for faculty operations **********
 ***********************************************/

const facultyRoutes = express.Router();

facultyRoutes.route("/new").post((req, res) => {
  let faculty = new Faculty({
    name: req.body.name,
    description: req.body.description,
  });
  faculty
    .save()
    .then((result) => {
      res.status(201).json({
        message: `Faculty of ${result.name} created successfully`,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

facultyRoutes.route("/").get(async (req, res) => {
  Faculty.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = facultyRoutes;
