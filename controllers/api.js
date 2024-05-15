const express = require("express");
const CourseModel = require("../models/CourseModel");
const Facilitator = require("../models/Facilitator");

const courseRoutes = express.Router();

// Adding a new course

courseRoutes.route("/new").post((req, res) => {
  let course = new CourseModel(req.body);

  course
    .save()
    .then(() => {
      res.status(201).json({ message: "Course Added Successfully" });
    })
    .catch((err) => {
      res.status(402).json({ message: "Failed with error: ", err });
    });
});

// Delete a course

courseRoutes.route("/delete/:code").get((req, res) => {
  let code = req.params.courseCode;
  let course = CourseModel;
  course
    .findOneAndDelete(code)
    .then((result) => {
      if (result) {
        res.status(201).json({ message: "Course removed succuessfully" });
      } else {
        res.status(400).json({ message: "Course Unavailable" });
      }
    })
    .catch((err) => {
      res.status(402).json({ message: "Failed with error: ", err });
    });
});

// Get all courses

courseRoutes.route("/").get((req, res) => {
  CourseModel.find({})
    .then((courses) => {
      res.json(courses);
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed with error: ", err });
    });
});

// Update course details

courseRoutes.route("/update/:code").post((req, res) => {
  let code = req.params.courseCode;
  let course = CourseModel;

  course
    .findOneAndUpdate(code, req.body, { new: true })
    .then((result) => {
      if (result) {
        res.status(201).json({ message: "Course updated succuessfully" });
      } else {
        res.status(400).json({ message: "Course Unavailable" });
      }
    })
    .catch((err) => {
      res.status(402).json({ message: "Failed with error: ", err });
    });
});

// Get a course by code

courseRoutes.route("/:code").get((req, res) => {
  let code = req.params.courseCode;
  let course = CourseModel;
  course
    .findOne({ code: code })
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({ message: "Course Unavailable" });
      }
    })
    .catch((err) => {
      res.status(402).json({ message: "Failed with error: ", err });
    });
});

// Assign a course to a facilitator

courseRoutes.route("/assign/facilitator").post(async (req, res) => {
  const { courseCode, staffId } = req.body;

  try {
    await CourseModel.findOne({ courseCode: courseCode }).then(
      async (course) => {
        if (course) {
          let name = course.name;
          let courseCode = course.courseCode;
          await Facilitator.findOne({ staffId: staffId })
            .then(async (facilitator) => {
              if (
                facilitator.courses.name != name &&
                facilitator.courses.courseCode != courseCode
              ) {
                await Facilitator.updateOne(
                  { staffId: staffId },
                  { $push: { courses: course } }
                )
                  .then(() => {
                    res
                      .status(201)
                      .json({ message: "Course assigned successfully" });
                  })
                  .catch(() => {
                    res
                      .status(401)
                      .json({ message: "Failed to assign course" });
                  });
              } else if (!facilitator) {
                res.status(401).json({ message: "Facilitator not found" });
              } else if (
                facilitator.courses.name == name ||
                facilitator.courses.courseCode == courseCode
              ) {
                res.status(403).json({ message: "Course already assigned" });
              } else {
                res.status(404).json({ message: "Error" });
              }
            })
            .catch((err) => {
              res.status(402).json({ message: "Failed with error: ", err });
            });
        } else {
          res.status(401).json({ message: "Course not found" });
        }
      }
    );
  } catch (err) {
    res.status(402).json({ message: "Failed with error: ", err });
  }
});

// Remove an assigned course

module.exports = courseRoutes;
