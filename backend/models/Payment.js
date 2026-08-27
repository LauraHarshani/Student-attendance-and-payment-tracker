const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    invoiceNumber:{
        type: String,
        required: true,
        unique: true,
    },
    studentName:{
        type: String,
        required: true,
    },
    studentId:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    paymentMonth:{
        type: String,
        required: true
    },
    paymentDate:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:["Paid", "Pending"],
        default: "Pending",
        required: true
    },
},{timestamps:true});

module.exports = mongoose.model("Payment", paymentSchema)