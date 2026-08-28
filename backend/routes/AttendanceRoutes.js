const express = require("express");
const {
    saveAttendance,
    getAttendanceByDate,
    getAttendanceHistory,
    getAttendanceByStudent,
    updateAttendance,
    deleteAttendance,
} = require("../controllers/AttendanceController")

const router = express.Router();

//save attendance
router.post("/", saveAttendance);

//get attendance for a date
router.get("/date/:date", getAttendanceByDate);

// Get all attendance history
router.get("/history", getAttendanceHistory);

//Get attendance by student
router.get("/student/:idNumber", getAttendanceByStudent);

//update one attendance record
router.put("/:id", updateAttendance);

//delete attendance record
router.delete("/:id", deleteAttendance);

module.exports = router;