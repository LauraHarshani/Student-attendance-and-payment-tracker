const Payment = require("../models/Payment");
const Student = require("../models/Student");

//create payment
const createPayment = async (req,res) =>{
    try{
        const {
            invoiceNumber,
            idNumber,
            amount,
            paymentMonth,
            paymentDate,
            status
        } = req.body;

        const student = await Student.findOne({idNumber});

        if(!student){
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const payment = await Payment.create({
            invoiceNumber,
            idNumber,
            amount,
            paymentMonth,
            paymentDate,
            status
        });

        res.status(201).json({
            message: "Payment created successfully",
            payment,
        });

    } catch(error){

        res.status(400).json({
            message: "Failed to create payment",
            error: error.message,
        });
    }
};

//get all payment
const getPayments = async (req,res)=>{

    try{
        const payments = await Payment.find().sort({paymentDate: -1});

        res.status(200).json({payments})
    } catch(error){

        res.status(500).json({
            message: "Failed to get payments",
            error: error.message,
        });
    }
};

//get one payment details
const getOnePayment = async (req,res)=>{
    try{
        const payment = await Payment.findById(req.params.id);

        if(!payment){
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json({payment});
    } catch(error){

        res.status(500).json({
            message: "Failed to get payment",
            error: error.message,
        });
    }
};

//get payment details by student
const getPaymentsByStudent = async (req, res) => {
    try {
        const { idNumber } = req.params;

        const student = await Student.findOne({ idNumber });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const payments = await Payment
            .find({ idNumber })
            .sort({ paymentDate: -1 });

        res.status(200).json({ payments });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get student payments",
            error: error.message
        });
    }
};

//update payment
const updatePayment = async (req,res)=>{

    try{
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if(!payment){
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json({
            message:"Payment updated successful",
            payment
        })
    } catch(error){

        res.status(400).json({
            message: "Failed to update payment",
            error: error.message,
        });
    }
};

//Delete payment
const deletePayment = async (req,res)=>{
    try{
        const payment = await Payment.findByIdAndDelete(req.params.id);

        if(!payment){
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json({
            message: "Payment deleted successfully"
        })
    } catch(error){

        res.status(500).json({
            message: "Failed to delete payment",
            error: error.message,
        });
    }
};

module.exports = {
    createPayment,
    getPayments,
    getOnePayment,
    getPaymentsByStudent,
    updatePayment,
    deletePayment
}