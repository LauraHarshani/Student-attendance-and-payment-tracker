const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;