const express = require("express");
const {
    createPayment,
    getPayments,
    getOnePayment,
    updatePayment,
    deletePayment,
} = require("../controllers/PaymentController")

const router = express.Router();

//create payment
router.post("/", createPayment);

//get all payment details
router.get("/", getPayments);

//get one payment details
router.get("/:id", getOnePayment);

//update payment
router.put("/:id", updatePayment);

//delete payment
router.delete("/:id", deletePayment);



module.exports = router;