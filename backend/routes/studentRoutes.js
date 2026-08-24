const express = require('express');
const router = express.Router();
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// Route to get all students and create a new student
router.route('/').get(getStudents).post(createStudent);

// Route to update and delete a specific student by ID
router.route('/:id').put(updateStudent).delete(deleteStudent);

module.exports = router;