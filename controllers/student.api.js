const express = require("express");
const ListedStudent = require("../models/ShortlistedStudents");

/**********************************************
 ****** Routes for student operations *********
 **********************************************/

const studentRoutes = express.Router();

/*************** Student shortlisting API *************/

studentRoutes.route("/shortlist").post((req, res) => {
  const { firstname, lastname, gender, studentId } = req.body;
  let listedStudent = new ListedStudent({
    firstname,
    lastname,
    gender,
    studentId,
  });
  listedStudent
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: "Shortlisted Student Added Successfully" });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "An error ocurred while processing your request" });
      console.error(err);
    });
});

/*************** Find shortlisted student by studentId *************/

studentRoutes.route("/shortlisted/").get((req, res) => {
  const studentId = req.body.studentId;
  ListedStudent.findOne({ studentId: studentId })
    .then((result) => {
      if (!result) {
        res.status(404).json({ message: "ID did not match any students" });
      } else {
        res.json(result);
      }
    })
    .catch(() => {
      res.json({ message: "Error" });
    });
});

module.exports = studentRoutes;
