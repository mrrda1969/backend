const express = require("express");
const facultyRoutes = require("../controllers/faculty.api");
const departmentRoutes = require("../controllers/department.api");
const programRoutes = require("../controllers/program.api");

const router = express();

router.use("/faculty", facultyRoutes);
router.use("/department", departmentRoutes);
router.use("/program", programRoutes);

module.exports = router;
