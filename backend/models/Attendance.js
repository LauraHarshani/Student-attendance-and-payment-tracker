const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    ref: 'Student',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  present: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;