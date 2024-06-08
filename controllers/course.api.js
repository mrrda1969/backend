const express = require("express");
const multer = require("multer");
const Course = require("../models/Course");
const Facilitator = require("../models/Facilitator");
const CourseAssignment = require("../models/CourseAssignment");

/**********************************************
 ****** Routes for course operations **********
 **********************************************/

const courseRoutes = express.Router();

/******** Multer upload function *******/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/******** API for creating a new course *******/

courseRoutes.post("/new", upload.single("image"), (req, res) => {
  const { name, courseCode, description } = req.body;
  const newCourse = new Course({
    name,
    courseCode,
    description,
    image: req.file ? req.file.originalname : null,
  });

  newCourse
    .save()
    .then((course) =>
      res
        .status(201)
        .json({ message: `Course ${course.courseCode} created successfully` })
    )
    .catch((err) => {
      res
        .status(400)
        .json({ message: "An error occured while processing your request" });
      console.log(err);
    });
});

/******** API for deleting a course *******/

courseRoutes.route("/delete/:code").get((req, res) => {
  let code = req.params.courseCode;
  let course = Course;
  course
    .findOneAndDelete(code)
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Course removed succuessfully" });
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed with error: ", err });
    });
});

/********** Get the list of all courses available  ********/

courseRoutes.route("/").get((req, res) => {
  Course.find({})
    .then((courses) => {
      if (courses) {
        res.json(courses);
      } else {
        res.status(404).json({ message: "No courses found" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed with error: ", err });
    });
});

/******** Update the details of a course *********/

courseRoutes.route("/update/:code").post((req, res) => {
  let code = req.params.courseCode;
  let course = Course;

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
      res.status(400).json({ message: "Failed with error: ", err });
    });
});

/******** Find a single course using the course code *******/

courseRoutes.route("/:code").get((req, res) => {
  let code = req.params.courseCode;
  let course = Course;
  course
    .findOne({ code: code })
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Course Unavailable" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed with error: ", err });
    });
});

/******** Assign a course to a facilitator *******/

courseRoutes.route("/assignment").post((req, res) => {
  let { facilitator, course } = req.body;

  let courseAssigned = new CourseAssignment({
    facilitator,
    course,
  });
  courseAssigned
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

/******** Retrieve assigned courses for a facilitator *******/

courseRoutes.route("/:username/mycourses").get((req, res) => {
  try {
    const username = req.params.username;
    Facilitator.findOne({ username: username }, { courses: 1 })
      .populate("courses")
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json("404 Not found");
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Error", err });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = courseRoutes;
