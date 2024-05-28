const express = require("express");
const multer = require("multer");
const CourseModel = require("../models/CourseModel");
const Facilitator = require("../models/Facilitator");
const ListedStudent = require("../models/ShortlistedStudents");

/**********************************************
 ****** Routes for course operations **********
 **********************************************/

const courseRoutes = express.Router();

/******** Multer upload function *******/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./storage");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/******** API for creating a new course *******/

courseRoutes.post("/new", upload.single("image"), (req, res) => {
  const { name, courseCode, description } = req.body;
  const newCourse = new CourseModel({
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
  let course = CourseModel;
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
  CourseModel.find({})
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
      res.status(400).json({ message: "Failed with error: ", err });
    });
});

/******** Find a single course using the course code *******/

courseRoutes.route("/:code").get((req, res) => {
  let code = req.params.courseCode;
  let course = CourseModel;
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

courseRoutes.route("/assign/facilitator").post(async (req, res) => {
  const { courseCode, staffId } = req.body;

  try {
    await CourseModel.find({ courseCode: { $in: courseCode } }).then(
      async (course) => {
        if (course) {
          await Facilitator.findOne({ staffId: staffId })
            .then(async (facilitator) => {
              if (facilitator) {
                await Facilitator.updateOne(
                  { staffId: staffId },
                  { $addToSet: { courses: course } }
                )
                  .then(() => {
                    res
                      .status(201)
                      .json({ message: "Course assigned successfully" });
                  })
                  .catch(() => {
                    res
                      .status(400)
                      .json({ message: "Failed to assign course" });
                  });
              } else if (!facilitator) {
                res.status(404).json({ message: "Facilitator not found" });
              } else {
                res.status(400).json({ message: "Error" });
              }
            })
            .catch((err) => {
              res.status(400).json({ message: "Failed with error: ", err });
            });
        } else {
          res.status(404).json({ message: "Course not found" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: "Failed with error: ", err });
  }
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

studentRoutes.route("/shortlisted/:studentId").get((req, res) => {
  const studentId = req.params.studentId;
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

module.exports = courseRoutes;
module.exports = studentRoutes;
