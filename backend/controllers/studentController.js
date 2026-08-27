const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, idNumber, email, phone, address, dob, gender, joinedDate } = req.body;

    const studentExists = await Student.findOne({ $or: [{ email }, { idNumber }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email or ID already exists' });
    }

    const student = await Student.create({ name, idNumber, email, phone, address, dob, gender, joinedDate });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.name = req.body.name || student.name;
      student.idNumber = req.body.idNumber || student.idNumber;
      student.email = req.body.email || student.email;
      student.phone = req.body.phone || student.phone;
      student.address = req.body.address || student.address;
      student.dob = req.body.dob || student.dob;
      student.gender = req.body.gender || student.gender;
      student.joinedDate = req.body.joinedDate || student.joinedDate;

      const updatedStudent = await student.save();
      res.status(200).json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.status(200).json({ message: 'Student removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};