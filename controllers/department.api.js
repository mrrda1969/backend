const express = require("express");
const Department = require("../models/Department");

/***********************************************
 ****** Routes for department operations **********
 ***********************************************/

const departmentRoutes = express.Router();

departmentRoutes.route("/new").post((req, res) => {
  let department = new Department(req.body);
  department
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: `${result.name} department created successfully` });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = departmentRoutes;
