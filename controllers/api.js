const express = require("express");
const multer = require("multer");
const CourseModel = require("../models/CourseModel");
const Facilitator = require("../models/Facilitator");

const courseRoutes = express.Router();

// multer storage function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./storage");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// api to create a course

courseRoutes.post("/new", upload.single("image"), (req, res) => {
  const { name, courseCode, description } = req.body;
  const newCourse = new CourseModel({
    name,
    courseCode,
    description,
    image: req.file ? req.file.originalname : null, // Handle case where file might not be uploaded
  });

  newCourse
    .save()
    .then((course) => res.json(course))
    .catch((err) => res.status(400).json("Error: " + err));
});

// retrieve an image for a course

// courseRoutes.get("/image/:filePath", (req, res) => {
//   const filePath = req.params.filePath;
//   res.sendFile(`${__dirname}/${filePath}`);
// });

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
      if (courses) {
        res.json(courses);
      } else {
        res.json("No course found");
      }
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
                      .status(401)
                      .json({ message: "Failed to assign course" });
                  });
              } else if (!facilitator) {
                res.status(401).json({ message: "Facilitator not found" });
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

// Retrieve assigned courses

courseRoutes.route("/:username/mycourses").get((req, res) => {
  try {
    const username = req.params.username;
    Facilitator.findOne({ username: username }, { courses: 1 })
      .populate("courses")
      .then((result) => {
        if (result) {
          res.json(result);
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
