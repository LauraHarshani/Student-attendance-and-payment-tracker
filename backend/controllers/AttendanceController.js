const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

//save attendance
const saveAttendance = async(req,res)=>{
    try{
        const {date , records} = req.body;

        if(!date || !records || !Array.isArray(records)){
            return res.status(400).json({
                message: "Date and attendance records are required"
            });
        }

        //check students exist
        for(const record of records){
            const student = await Student.findOne({
                idNumber: record.idNumber
            });

            if(!student){
                return res.status(404).json({
                    message: `Student ${record.idNumber} not found`
                });
            }
        }

        //Remove existing attendance for this date
        await Attendance.deleteMany({date});

        //create new attendance records
        const attendanceRecords = records.map((record)=>({
            date,
            idNumber: record.idNumber,
            status: record.status
        }));

        const savedRecords = await Attendance.insertMany(
            attendanceRecords
        );

        res.status(201).json({
            message: "Attendance saved successfully",
            records: savedRecords,
        });

    }catch(error){
        res.status(500).json({
            message: "Failed to save attendance records",
            error: error.message,
        });
    }
};

//get attendance for a date
const getAttendanceByDate = async(req, res)=>{
    try{
        const {date} = req.params;

        const records = await Attendance.find({date})

        res.status(200).json(records);
    }catch(error){
        res.status(500).json({
            message: "Failed to get attendance",
            error: error.message,
        });
    }
};

// Get all attendance history
const getAttendanceHistory = async (req,res)=>{
    try{
        const records = await Attendance.find().sort({date:-1});

        res.status(200).json(records);
    }catch(error){
        res.status(500).json({
            message: "Failed to get attendance history",
            error: error.message,
        });
    }
};

//get attendance by student
const getAttendanceByStudent = async (req, res) => {
    try {
        const { idNumber } = req.params;

        const student = await Student.findOne({ idNumber });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const records = await Attendance
            .find({ idNumber })
            .sort({ date: -1 });

        res.status(200).json(records);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get student attendance",
            error: error.message
        });
    }
};

//update one attendance record
const updateAttendance = async(req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;

        const record = await Attendance.findByIdAndUpdate(
            id,
            {status},
            {
                new: true,
                runValidators: true,
            }
        );

        if(!record){
            return res.status(404).json({
                message: "Attendance record not found",
            });
        }

        res.status(200).json({
            message: "Attendance updated successfully",
            record,
        });
    }catch(error){
        res.status(500).json({
            message: "Failed to update attendance",
            error: error.message,
        });
    }
};

//delete attendance record
const deleteAttendance =async (req,res)=>{
    try{
        const {id} = req.params;

        const record = await Attendance.findByIdAndDelete(id);

        if(!record){
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message: "Failed to delete attendance",
            error: error.message,
        });
    }
};

module.exports ={
    saveAttendance,
    getAttendanceByDate,
    getAttendanceByStudent,
    getAttendanceHistory,
    updateAttendance,
    deleteAttendance,
};