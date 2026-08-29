const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance'); 
const Payment = require('../models/Payment');      

router.get('/stats', async (req, res) => {
    try {
        
        const totalStudents = await Student.countDocuments();

        
        const today = new Date().toISOString().split('T')[0];
        const presentToday = await Attendance.countDocuments({ date: today, present: true });

        
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        
        const monthlyIncomeResult = await Payment.aggregate([
            { 
                $match: { 
                    status: 'Paid', 
                    date: { $gte: startOfMonth } 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$amount' } 
                } 
            }
        ]);

        const monthlyIncome = monthlyIncomeResult.length > 0 ? monthlyIncomeResult[0].total : 0;

        res.json({
            totalStudents,
            presentToday,
            monthlyIncome
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/attendance-percentage', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const today = new Date().toISOString().split('T')[0];
        const presentToday = await Attendance.countDocuments({ date: today, present: true });

        const percentage = totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0;
        res.json({ percentage: percentage.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/payment-stats', async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: '$status',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;